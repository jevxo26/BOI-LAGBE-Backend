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
import { ListDeliveryQueryDto } from './dto/list-delivery-query.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { AddDeliveryTrackingDto } from './dto/add-delivery-tracking.dto';
import {
  OrderDelivery,
  OrderDeliveryStatus,
  OrderTracking,
  Order,
  OrderStatus,
  OrderHistory,
} from '../orders/entities';

// Delivery-run pipeline:
//   PENDING -> ASSIGNED -> IN_TRANSIT -> DELIVERED
//   Branches: PENDING/ASSIGNED/IN_TRANSIT -> FAILED. Terminal states locked.
// Each status change writes an OrderTracking event; reaching DELIVERED also
// flips the parent order to DELIVERED.
@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(OrderDelivery)
    private readonly deliveryRepository: Repository<OrderDelivery>,
    @InjectRepository(OrderTracking)
    private readonly trackingRepository: Repository<OrderTracking>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderHistory)
    private readonly historyRepository: Repository<OrderHistory>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  async findAll(query: ListDeliveryQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.riderId) where.riderId = query.riderId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      sortableFields: ['status', 'assignedAt', 'deliveredAt', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.deliveryRepository.findAndCount({
      ...options,
      relations: { order: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findById(id: string) {
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
      relations: { order: true },
    });
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    const tracking = await this.trackingRepository.find({
      where: { deliveryId: id },
      order: { trackedAt: 'DESC' },
      take: 100,
    });
    return { ...delivery, tracking };
  }

  // PENDING -> ASSIGNED -> IN_TRANSIT -> DELIVERED (| FAILED). Writes a
  // tracking event for every transition; DELIVERED also advances the order.
  async updateStatus(
    id: string,
    dto: UpdateDeliveryStatusDto,
    req: AdminRequest,
  ) {
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
      relations: { order: true },
    });
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }
    this.assertStatusTransition(delivery.status, dto.status);

    const oldValue = { ...delivery };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (dto.status === OrderDeliveryStatus.IN_TRANSIT) {
        // An assigned rider is required before a run can go in transit
        if (!delivery.riderId) {
          throw new BadRequestException(
            'No rider assigned — assign a rider before dispatch',
          );
        }
      } else if (dto.status === OrderDeliveryStatus.DELIVERED) {
        delivery.deliveredAt = new Date();
      }

      delivery.status = dto.status;
      await queryRunner.manager.save(delivery);

      await queryRunner.manager.save(
        queryRunner.manager.create(OrderTracking, {
          deliveryId: id,
          status: dto.status,
          location: dto.location,
          description: dto.description ?? `Delivery marked ${dto.status}`,
          trackedAt: new Date(),
        }),
      );

      // A delivered run advances the parent order to DELIVERED
      if (
        dto.status === OrderDeliveryStatus.DELIVERED &&
        delivery.order.status !== OrderStatus.DELIVERED
      ) {
        delivery.order.status = OrderStatus.DELIVERED;
        delivery.order.updatedBy = req.user.id;
        await queryRunner.manager.save(delivery.order);

        await queryRunner.manager.save(
          queryRunner.manager.create(OrderHistory, {
            orderId: delivery.orderId,
            action: 'ORDER_DELIVERED',
            description: `Order ${delivery.order.orderCode} delivered`,
            performedBy: req.user.id,
          }),
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.adminAuditService.log(
      req,
      'DELIVERY',
      'DELIVERY_STATUS_UPDATE',
      'OrderDelivery',
      id,
      `Delivery for order ${delivery.order.orderCode} marked ${dto.status}`,
      oldValue,
      delivery,
    );

    return { message: 'Delivery status updated', delivery };
  }

  // Adds a standalone tracking event without changing the delivery status.
  async addTracking(
    id: string,
    dto: AddDeliveryTrackingDto,
    req: AdminRequest,
  ) {
    const delivery = await this.deliveryRepository.findOne({ where: { id } });
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    const tracking = await this.trackingRepository.save(
      this.trackingRepository.create({
        deliveryId: id,
        status: dto.status,
        location: dto.location,
        description: dto.description,
        trackedAt: new Date(),
      }),
    );

    await this.adminAuditService.log(
      req,
      'DELIVERY',
      'DELIVERY_TRACKING_ADDED',
      'OrderTracking',
      tracking.id,
      `Added tracking event ${dto.status} to delivery ${id}`,
      undefined,
      tracking,
    );

    return { message: 'Tracking event added successfully', tracking };
  }

  async findTracking(deliveryId: string) {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
    });
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }
    return this.trackingRepository.find({
      where: { deliveryId },
      order: { trackedAt: 'DESC' },
      take: 100,
    });
  }

  private assertStatusTransition(
    current: OrderDeliveryStatus,
    target: OrderDeliveryStatus,
  ) {
    const transitions: Record<OrderDeliveryStatus, OrderDeliveryStatus[]> = {
      [OrderDeliveryStatus.PENDING]: [
        OrderDeliveryStatus.ASSIGNED,
        OrderDeliveryStatus.FAILED,
      ],
      [OrderDeliveryStatus.ASSIGNED]: [
        OrderDeliveryStatus.IN_TRANSIT,
        OrderDeliveryStatus.FAILED,
      ],
      [OrderDeliveryStatus.IN_TRANSIT]: [
        OrderDeliveryStatus.DELIVERED,
        OrderDeliveryStatus.FAILED,
      ],
      [OrderDeliveryStatus.DELIVERED]: [],
      [OrderDeliveryStatus.FAILED]: [],
    };

    const allowed = transitions[current] ?? [];
    if (!allowed.includes(target)) {
      throw new BadRequestException(
        `Cannot move delivery from ${current} to ${target}`,
      );
    }
  }
}
