import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { QueryBuilder } from '../common/utils/query-builder';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListOrderQueryDto } from './dto/list-order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AssignAgentDto } from './dto/assign-agent.dto';
import { AssignRiderDto } from './dto/assign-rider.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateOrderReturnDto } from './dto/create-order-return.dto';
import { CreateOrderRefundDto } from './dto/create-order-refund.dto';
import { CreateOrderExchangeDto } from './dto/create-order-exchange.dto';
import { ListOrderReturnQueryDto } from './dto/list-order-return-query.dto';
import { ListOrderAnalyticsQueryDto } from './dto/list-order-analytics-query.dto';
import { ListOrderReportQueryDto } from './dto/list-order-report-query.dto';
import {
  Order,
  OrderStatus,
  OrderItem,
  OrderTimeline,
  OrderPayment,
  OrderPaymentStatus,
  OrderReturn,
  OrderReturnStatus,
  OrderRefund,
  OrderRefundStatus,
  OrderCancel,
  OrderExchange,
  OrderExchangeStatus,
  OrderHistory,
  OrderAnalytics,
  OrderReport,
  OrderDelivery,
  OrderDeliveryStatus,
} from './entities';

// Order lifecycle (admin-managed):
//   PENDING -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED
//   Branches: active states -> CANCELLED, DELIVERED -> RETURNED (-> REFUNDED)
//   or EXCHANGED. Returns/refunds/exchanges go through the dedicated
//   endpoints below, which create their own records.
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderTimeline)
    private readonly timelineRepository: Repository<OrderTimeline>,
    @InjectRepository(OrderPayment)
    private readonly paymentRepository: Repository<OrderPayment>,
    @InjectRepository(OrderReturn)
    private readonly returnRepository: Repository<OrderReturn>,
    @InjectRepository(OrderRefund)
    private readonly refundRepository: Repository<OrderRefund>,
    @InjectRepository(OrderCancel)
    private readonly cancelRepository: Repository<OrderCancel>,
    @InjectRepository(OrderExchange)
    private readonly exchangeRepository: Repository<OrderExchange>,
    @InjectRepository(OrderHistory)
    private readonly historyRepository: Repository<OrderHistory>,
    @InjectRepository(OrderDelivery)
    private readonly deliveryRepository: Repository<OrderDelivery>,
    @InjectRepository(OrderAnalytics)
    private readonly analyticsRepository: Repository<OrderAnalytics>,
    @InjectRepository(OrderReport)
    private readonly reportRepository: Repository<OrderReport>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- ORDER OVERSIGHT ----------

  async findAllOrders(query: ListOrderQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;
    if (query.agentId) where.agentId = query.agentId;
    if (query.riderId) where.riderId = query.riderId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['orderCode'],
      sortableFields: ['orderCode', 'totalAmount', 'status', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.orderRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findOrderById(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const [items, timeline, payments, history] = await Promise.all([
      this.orderItemRepository.find({ where: { orderId: id } }),
      this.timelineRepository.find({
        where: { orderId: id },
        order: { createdAt: 'DESC' },
        take: 100,
      }),
      this.paymentRepository.find({ where: { orderId: id } }),
      this.historyRepository.find({
        where: { orderId: id },
        order: { createdAt: 'DESC' },
        take: 100,
      }),
    ]);
    return { ...order, items, timeline, payments, history };
  }

  // Generic status transition with a forward-only guard. The dedicated
  // endpoints (return/refund/exchange) are the intended paths for those
  // statuses, so they are NOT reachable through the generic PATCH.
  async updateOrderStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    req: AdminRequest,
  ) {
    const order = await this.getOrderOrThrow(id);
    this.assertStatusTransition(order.status, dto.status);

    const oldValue = { ...order };
    order.status = dto.status;
    order.updatedBy = req.user.id;
    const saved = await this.orderRepository.save(order);

    await this.saveTimelineAndHistory(
      req,
      id,
      `ORDER_${dto.status}`,
      `Order ${order.orderCode} marked ${dto.status}${
        dto.remarks ? ` (${dto.remarks})` : ''
      }`,
    );

    await this.adminAuditService.log(
      req,
      'ORDERS',
      'STATUS_UPDATE',
      'Order',
      id,
      `Updated order ${order.orderCode} status to ${dto.status}`,
      oldValue,
      saved,
    );

    return { message: 'Order status updated', order: saved };
  }

  // ---------- ASSIGNMENTS ----------

  // Assigns (or reassigns) the agent responsible for the order.
  async assignAgent(id: string, dto: AssignAgentDto, req: AdminRequest) {
    const order = await this.getOrderOrThrow(id);
    this.assertActive(order);

    const oldValue = { ...order };
    order.agentId = dto.agentId;
    order.updatedBy = req.user.id;
    const saved = await this.orderRepository.save(order);

    await this.saveTimelineAndHistory(
      req,
      id,
      'AGENT_ASSIGNED',
      `Agent ${dto.agentId} assigned to order ${order.orderCode}`,
    );
    await this.adminAuditService.log(
      req,
      'ORDERS',
      'AGENT_ASSIGNED',
      'Order',
      id,
      `Assigned agent ${dto.agentId} to order ${order.orderCode}`,
      oldValue,
      saved,
    );

    return { message: 'Agent assigned successfully', order: saved };
  }

  // Assigns a rider and opens (or updates) the delivery run for the order.
  async assignRider(id: string, dto: AssignRiderDto, req: AdminRequest) {
    const order = await this.getOrderOrThrow(id);
    this.assertActive(order);

    const existing = await this.deliveryRepository.findOne({
      where: { orderId: id, riderId: dto.riderId },
    });

    const oldValue = { ...order };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (existing) {
        existing.status = OrderDeliveryStatus.ASSIGNED;
        existing.assignedAt = new Date();
        await queryRunner.manager.save(existing);
      } else {
        await queryRunner.manager.save(
          queryRunner.manager.create(OrderDelivery, {
            orderId: id,
            riderId: dto.riderId,
            status: OrderDeliveryStatus.ASSIGNED,
            assignedAt: new Date(),
          }),
        );
      }

      order.riderId = dto.riderId;
      order.updatedBy = req.user.id;
      await queryRunner.manager.save(order);

      await queryRunner.manager.save(
        queryRunner.manager.create(OrderHistory, {
          orderId: id,
          action: 'RIDER_ASSIGNED',
          description: `Rider ${dto.riderId} assigned to order ${order.orderCode}`,
          performedBy: req.user.id,
        }),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.adminAuditService.log(
      req,
      'ORDERS',
      'RIDER_ASSIGNED',
      'Order',
      id,
      `Assigned rider ${dto.riderId} to order ${order.orderCode}`,
      oldValue,
      order,
    );

    return { message: 'Rider assigned successfully', order };
  }

  // ---------- CANCEL ----------

  // Active state -> CANCELLED. Creates the cancel record.
  async cancelOrder(id: string, dto: CancelOrderDto, req: AdminRequest) {
    const order = await this.getOrderOrThrow(id);
    this.assertActive(order);

    const oldValue = { ...order };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        queryRunner.manager.create(OrderCancel, {
          orderId: id,
          userId: order.userId,
          reason: dto.reason,
          cancelledBy: req.user.id,
          cancelledAt: new Date(),
        }),
      );

      order.status = OrderStatus.CANCELLED;
      order.updatedBy = req.user.id;
      await queryRunner.manager.save(order);

      await queryRunner.manager.save(
        queryRunner.manager.create(OrderHistory, {
          orderId: id,
          action: 'ORDER_CANCELLED',
          description: `Order ${order.orderCode} cancelled${
            dto.reason ? ` (${dto.reason})` : ''
          }`,
          performedBy: req.user.id,
        }),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.adminAuditService.log(
      req,
      'ORDERS',
      'ORDER_CANCELLED',
      'Order',
      id,
      `Cancelled order ${order.orderCode}`,
      oldValue,
      order,
    );

    return { message: 'Order cancelled successfully', order };
  }

  // ---------- RETURN ----------

  // DELIVERED -> RETURNED. Creates the return record (REQUESTED).
  async createReturn(id: string, dto: CreateOrderReturnDto, req: AdminRequest) {
    const order = await this.getOrderOrThrow(id);
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException(
        `Order cannot be returned in its current status (${order.status})`,
      );
    }

    const oldValue = { ...order };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        queryRunner.manager.create(OrderReturn, {
          returnCode: this.nextCode('OR'),
          orderId: id,
          userId: order.userId,
          reason: dto.reason,
          status: OrderReturnStatus.REQUESTED,
          requestedAt: new Date(),
        }),
      );

      order.status = OrderStatus.RETURNED;
      order.updatedBy = req.user.id;
      await queryRunner.manager.save(order);

      await queryRunner.manager.save(
        queryRunner.manager.create(OrderHistory, {
          orderId: id,
          action: 'ORDER_RETURNED',
          description: `Order ${order.orderCode} returned (${dto.reason})`,
          performedBy: req.user.id,
        }),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.adminAuditService.log(
      req,
      'ORDERS',
      'ORDER_RETURNED',
      'Order',
      id,
      `Order ${order.orderCode} returned (${dto.reason})`,
      oldValue,
      order,
    );

    return { message: 'Order return created successfully', order };
  }

  async findAllReturns(query: ListOrderReturnQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['returnCode'],
      sortableFields: ['returnCode', 'status', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.returnRepository.findAndCount({
      ...options,
      relations: { order: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- REFUND ----------

  // RETURNED | CANCELLED -> REFUNDED. Creates the refund record and marks
  // any completed payment as refunded.
  async createRefund(id: string, dto: CreateOrderRefundDto, req: AdminRequest) {
    const order = await this.getOrderOrThrow(id);
    if (
      order.status !== OrderStatus.RETURNED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Order cannot be refunded in its current status (${order.status})`,
      );
    }
    if (dto.amount > order.totalAmount) {
      throw new BadRequestException(
        'Refund amount cannot exceed the order total',
      );
    }

    const payment = await this.paymentRepository.findOne({
      where: { orderId: id, status: OrderPaymentStatus.COMPLETED },
    });

    const oldValue = { ...order };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        queryRunner.manager.create(OrderRefund, {
          refundCode: this.nextCode('RF'),
          orderId: id,
          paymentId: payment?.id,
          userId: order.userId,
          amount: dto.amount,
          method: dto.method,
          status: OrderRefundStatus.COMPLETED,
          processedBy: req.user.id,
          processedAt: new Date(),
        }),
      );

      if (payment) {
        payment.status = OrderPaymentStatus.REFUNDED;
        await queryRunner.manager.save(payment);
      }

      order.status = OrderStatus.REFUNDED;
      order.updatedBy = req.user.id;
      await queryRunner.manager.save(order);

      await queryRunner.manager.save(
        queryRunner.manager.create(OrderHistory, {
          orderId: id,
          action: 'ORDER_REFUNDED',
          description: `Order ${order.orderCode} refunded ${dto.amount}${
            dto.remarks ? ` (${dto.remarks})` : ''
          }`,
          performedBy: req.user.id,
        }),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.adminAuditService.log(
      req,
      'ORDERS',
      'ORDER_REFUNDED',
      'Order',
      id,
      `Refunded ${dto.amount} for order ${order.orderCode}`,
      oldValue,
      order,
    );

    return { message: 'Order refund created successfully', order };
  }

  // ---------- EXCHANGE ----------

  // DELIVERED -> EXCHANGED. Creates the exchange record.
  async createExchange(
    id: string,
    dto: CreateOrderExchangeDto,
    req: AdminRequest,
  ) {
    const order = await this.getOrderOrThrow(id);
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException(
        `Order cannot be exchanged in its current status (${order.status})`,
      );
    }

    const oldValue = { ...order };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        queryRunner.manager.create(OrderExchange, {
          exchangeCode: this.nextCode('OE'),
          orderId: id,
          userId: order.userId,
          reason: dto.reason,
          status: OrderExchangeStatus.REQUESTED,
          processedBy: req.user.id,
          processedAt: new Date(),
        }),
      );

      order.status = OrderStatus.EXCHANGED;
      order.updatedBy = req.user.id;
      await queryRunner.manager.save(order);

      await queryRunner.manager.save(
        queryRunner.manager.create(OrderHistory, {
          orderId: id,
          action: 'ORDER_EXCHANGED',
          description: `Order ${order.orderCode} exchanged (${dto.reason})`,
          performedBy: req.user.id,
        }),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.adminAuditService.log(
      req,
      'ORDERS',
      'ORDER_EXCHANGED',
      'Order',
      id,
      `Order ${order.orderCode} exchanged (${dto.reason})`,
      oldValue,
      order,
    );

    return { message: 'Order exchange created successfully', order };
  }

  // ---------- ANALYTICS + REPORTS ----------

  // Pre-computed analytics rows (populated by BI jobs).
  async findAllAnalytics(query: ListOrderAnalyticsQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.period) where.period = query.period;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      sortableFields: ['period', 'metric', 'value', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.analyticsRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAllReports(query: ListOrderReportQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.reportType) where.reportType = query.reportType;
    if (query.title) where.title = query.title;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['title', 'reportCode'],
      sortableFields: ['title', 'reportCode', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.reportRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- PRIVATE HELPERS ----------

  private async getOrderOrThrow(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  // Blocks assignments and cancellation on terminal states. Post-delivery
  // actions (return/refund/exchange) go through the dedicated endpoints, so
  // cancel/assign must not reach DELIVERED or the terminal exception states.
  private assertActive(order: Order) {
    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Order is already delivered');
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is cancelled');
    }
    if (order.status === OrderStatus.RETURNED) {
      throw new BadRequestException('Order is returned');
    }
    if (order.status === OrderStatus.REFUNDED) {
      throw new BadRequestException('Order is refunded');
    }
    if (order.status === OrderStatus.EXCHANGED) {
      throw new BadRequestException('Order is exchanged');
    }
  }

  // Forward-only movement through the main pipeline. CANCELLED is reachable
  // from every active state; DELIVERED only from SHIPPED. The return/refund/
  // exchange statuses are intentionally absent — use the dedicated endpoints.
  private assertStatusTransition(current: OrderStatus, target: OrderStatus) {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.RETURNED]: [],
      [OrderStatus.REFUNDED]: [],
      [OrderStatus.EXCHANGED]: [],
    };

    const allowed = transitions[current] ?? [];
    if (!allowed.includes(target)) {
      throw new BadRequestException(`Cannot move from ${current} to ${target}`);
    }
  }

  private async saveTimelineAndHistory(
    req: AdminRequest,
    orderId: string,
    action: string,
    description: string,
  ) {
    await this.timelineRepository.save(
      this.timelineRepository.create({
        orderId,
        title: action,
        description,
        performedBy: req.user.id,
      }),
    );
    await this.historyRepository.save(
      this.historyRepository.create({
        orderId,
        action,
        description,
        performedBy: req.user.id,
      }),
    );
  }

  private nextCode(prefix: string): string {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
  }
}
