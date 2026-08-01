import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { QueryBuilder } from '../common/utils/query-builder';
import { cleanDto } from '../common/utils/dto.util';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListCustomOrderQueryDto } from './dto/list-custom-order-query.dto';
import { UpdateCustomOrderStatusDto } from './dto/update-custom-order-status.dto';
import { CreateCustomQuotationDto } from './dto/create-custom-quotation.dto';
import { ApproveCustomOrderDto } from './dto/approve-custom-order.dto';
import { StartProductionDto } from './dto/start-production.dto';
import { AddProductionStageDto } from './dto/add-production-stage.dto';
import { UpdateProductionStageStatusDto } from './dto/update-production-stage-status.dto';
import { ScheduleCustomDeliveryDto } from './dto/schedule-custom-delivery.dto';
import { CreatePrintServiceDto } from './dto/create-print-service.dto';
import { CreatePrintJobDto } from './dto/create-print-job.dto';
import { UpdatePrintJobStatusDto } from './dto/update-print-job-status.dto';
import { ListPrintJobQueryDto } from './dto/list-print-job-query.dto';
import { ListCustomAnalyticsQueryDto } from './dto/list-custom-analytics-query.dto';
import { ListCustomReportQueryDto } from './dto/list-custom-report-query.dto';
import {
  CustomOrder,
  CustomOrderStatus,
  CustomOrderItem,
  CustomQuotation,
  CustomQuotationStatus,
  CustomApproval,
  CustomApprovalStatus,
  CustomProduction,
  CustomProductionStatus,
  CustomProductionStage,
  CustomProductionStageStatus,
  CustomDeliverySchedule,
  CustomDeliveryScheduleStatus,
  CustomOrderHistory,
  PrintService,
  PrintServiceStatus,
  PrintJob,
  PrintJobStatus,
  PrintPricing,
  CustomAnalytics,
  CustomReport,
} from './entities';

// Custom-order pipeline (admin-managed):
//   PENDING_QUOTATION -> QUOTATION_SENT -> QUOTATION_APPROVED
//     -> IN_PRODUCTION -> READY_FOR_DELIVERY -> DELIVERED
//   Rejection / cancellation branches: QUOTATION_SENT -> QUOTATION_REJECTED
//   (can be re-quoted), any active state -> CANCELLED.
@Injectable()
export class CustomOrdersService {
  constructor(
    @InjectRepository(CustomOrder)
    private readonly orderRepository: Repository<CustomOrder>,
    @InjectRepository(CustomOrderItem)
    private readonly orderItemRepository: Repository<CustomOrderItem>,
    @InjectRepository(CustomQuotation)
    private readonly quotationRepository: Repository<CustomQuotation>,
    @InjectRepository(CustomApproval)
    private readonly approvalRepository: Repository<CustomApproval>,
    @InjectRepository(CustomProduction)
    private readonly productionRepository: Repository<CustomProduction>,
    @InjectRepository(CustomProductionStage)
    private readonly productionStageRepository: Repository<CustomProductionStage>,
    @InjectRepository(CustomDeliverySchedule)
    private readonly deliveryRepository: Repository<CustomDeliverySchedule>,
    @InjectRepository(CustomOrderHistory)
    private readonly historyRepository: Repository<CustomOrderHistory>,
    @InjectRepository(PrintService)
    private readonly printServiceRepository: Repository<PrintService>,
    @InjectRepository(PrintJob)
    private readonly printJobRepository: Repository<PrintJob>,
    @InjectRepository(PrintPricing)
    private readonly printPricingRepository: Repository<PrintPricing>,
    @InjectRepository(CustomAnalytics)
    private readonly analyticsRepository: Repository<CustomAnalytics>,
    @InjectRepository(CustomReport)
    private readonly reportRepository: Repository<CustomReport>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- ORDERS ----------

  async findAllOrders(query: ListCustomOrderQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;

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
      throw new NotFoundException('Custom order not found');
    }

    const items = await this.orderItemRepository.find({
      where: { orderId: id },
    });
    const history = await this.historyRepository.find({
      where: { orderId: id },
      order: { createdAt: 'DESC' },
      take: 100,
    });
    return { ...order, items, history };
  }

  // Generic status transition with a guard: the workflow moves through the
  // dedicated endpoints (quotation/approve/production/delivery) but admin can
  // also mark delivered or cancel from any active state.
  async updateOrderStatus(
    id: string,
    dto: UpdateCustomOrderStatusDto,
    req: AdminRequest,
  ) {
    const order = await this.getOrderOrThrow(id);
    this.assertOrderStatusTransition(order.status, dto.status);

    const oldValue = { ...order };
    order.status = dto.status;
    order.updatedBy = req.user.id;
    const saved = await this.orderRepository.save(order);

    await this.recordHistory(
      req,
      id,
      `ORDER_${dto.status}`,
      `Custom order ${order.orderCode} marked ${dto.status}${
        dto.remarks ? ` (${dto.remarks})` : ''
      }`,
    );

    await this.adminAuditService.log(
      req,
      'CUSTOM_ORDERS',
      'STATUS_UPDATE',
      'CustomOrder',
      id,
      `Updated custom order ${order.orderCode} status to ${dto.status}`,
      oldValue,
      saved,
    );

    return { message: 'Custom order status updated', order: saved };
  }

  // ---------- QUOTATION ----------

  // PENDING_QUOTATION -> QUOTATION_SENT. Creates the quotation record and
  // mirrors the quoted amounts onto the order.
  async createQuotation(
    id: string,
    dto: CreateCustomQuotationDto,
    req: AdminRequest,
  ) {
    const order = await this.getOrderOrThrow(id);
    this.assertOrderStatus(
      order,
      [CustomOrderStatus.PENDING_QUOTATION],
      'quoted',
    );

    const oldValue = { ...order };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const quotation = await queryRunner.manager.save(
        queryRunner.manager.create(CustomQuotation, {
          orderId: id,
          quotationCode: this.nextCode('CQ'),
          subtotal: dto.subtotal,
          discount: dto.discount ?? 0,
          tax: dto.tax ?? 0,
          shippingCost: dto.shippingCost ?? 0,
          totalAmount: dto.totalAmount,
          validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
          status: CustomQuotationStatus.SENT,
          createdBy: req.user.id,
        }),
      );

      order.status = CustomOrderStatus.QUOTATION_SENT;
      // Mirror the quoted grand total (incl. shipping) onto the order; the
      // discount/tax columns carry the breakdown for reporting.
      order.totalAmount = dto.totalAmount;
      order.discount = dto.discount ?? 0;
      order.tax = dto.tax ?? 0;
      order.finalAmount = dto.totalAmount;
      order.updatedBy = req.user.id;
      await queryRunner.manager.save(order);

      await queryRunner.manager.save(
        queryRunner.manager.create(CustomOrderHistory, {
          orderId: id,
          action: 'QUOTATION_SENT',
          description: `Quotation ${quotation.quotationCode} sent (total ${dto.totalAmount})`,
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
      'CUSTOM_ORDERS',
      'QUOTATION_SENT',
      'CustomOrder',
      id,
      `Sent quotation for custom order ${order.orderCode} (total ${dto.totalAmount})`,
      oldValue,
      order,
    );

    return { message: 'Quotation sent successfully', order };
  }

  // QUOTATION_SENT -> QUOTATION_APPROVED | QUOTATION_REJECTED. Records the
  // internal approval decision and updates the latest quotation.
  async approveOrder(
    id: string,
    dto: ApproveCustomOrderDto,
    req: AdminRequest,
  ) {
    const order = await this.getOrderOrThrow(id);
    this.assertOrderStatus(
      order,
      [CustomOrderStatus.QUOTATION_SENT],
      'approved',
    );

    const quotation = await this.quotationRepository.findOne({
      where: { orderId: id, status: CustomQuotationStatus.SENT },
      order: { createdAt: 'DESC' },
    });

    const oldValue = { ...order };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        queryRunner.manager.create(CustomApproval, {
          orderId: id,
          quotationId: quotation?.id,
          requestedBy: req.user.id,
          approvedBy: req.user.id,
          status: dto.approved
            ? CustomApprovalStatus.APPROVED
            : CustomApprovalStatus.REJECTED,
          remarks: dto.remarks,
          approvedAt: new Date(),
        }),
      );

      if (quotation) {
        quotation.status = dto.approved
          ? CustomQuotationStatus.ACCEPTED
          : CustomQuotationStatus.DECLINED;
        await queryRunner.manager.save(quotation);
      }

      order.status = dto.approved
        ? CustomOrderStatus.QUOTATION_APPROVED
        : CustomOrderStatus.QUOTATION_REJECTED;
      order.updatedBy = req.user.id;
      await queryRunner.manager.save(order);

      await queryRunner.manager.save(
        queryRunner.manager.create(CustomOrderHistory, {
          orderId: id,
          action: dto.approved ? 'QUOTATION_APPROVED' : 'QUOTATION_REJECTED',
          description: `${dto.approved ? 'Approved' : 'Rejected'} quotation for custom order ${order.orderCode}${
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
      'CUSTOM_ORDERS',
      dto.approved ? 'QUOTATION_APPROVED' : 'QUOTATION_REJECTED',
      'CustomOrder',
      id,
      `${dto.approved ? 'Approved' : 'Rejected'} quotation for custom order ${order.orderCode}`,
      oldValue,
      order,
    );

    return {
      message: dto.approved
        ? 'Quotation approved — order moves to production'
        : 'Quotation rejected',
      order,
    };
  }

  // ---------- PRODUCTION ----------

  // QUOTATION_APPROVED -> IN_PRODUCTION. Creates the production record plus
  // its first stage.
  async startProduction(
    id: string,
    dto: StartProductionDto,
    req: AdminRequest,
  ) {
    const order = await this.getOrderOrThrow(id);
    this.assertOrderStatus(
      order,
      [CustomOrderStatus.QUOTATION_APPROVED],
      'started in production',
    );

    const oldValue = { ...order };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const production = await queryRunner.manager.save(
        queryRunner.manager.create(CustomProduction, {
          orderId: id,
          startedBy: req.user.id,
          startDate: new Date(),
          estimatedCompletionDate: dto.estimatedCompletionDate
            ? new Date(dto.estimatedCompletionDate)
            : null,
          remarks: dto.remarks,
          status: CustomProductionStatus.IN_PROGRESS,
        }),
      );

      await queryRunner.manager.save(
        queryRunner.manager.create(CustomProductionStage, {
          productionId: production.id,
          stageName: 'PRODUCTION_STARTED',
          stageOrder: 1,
          startedAt: new Date(),
          status: CustomProductionStageStatus.IN_PROGRESS,
        }),
      );

      order.status = CustomOrderStatus.IN_PRODUCTION;
      order.updatedBy = req.user.id;
      await queryRunner.manager.save(order);

      await queryRunner.manager.save(
        queryRunner.manager.create(CustomOrderHistory, {
          orderId: id,
          action: 'PRODUCTION_STARTED',
          description: `Production started for custom order ${order.orderCode}${
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
      'CUSTOM_ORDERS',
      'PRODUCTION_STARTED',
      'CustomOrder',
      id,
      `Started production for custom order ${order.orderCode}`,
      oldValue,
      order,
    );

    return { message: 'Production started successfully', order };
  }

  // Adds a stage to the order's active production run.
  async addProductionStage(
    id: string,
    dto: AddProductionStageDto,
    req: AdminRequest,
  ) {
    const order = await this.getOrderOrThrow(id);
    this.assertOrderStatus(
      order,
      [CustomOrderStatus.IN_PRODUCTION],
      'given production stages',
    );

    const production = await this.productionRepository.findOne({
      where: { orderId: id },
      order: { createdAt: 'DESC' },
    });
    if (!production) {
      throw new BadRequestException(
        'No production run exists for this order — start production first',
      );
    }

    const lastStage = await this.productionStageRepository.findOne({
      where: { productionId: production.id },
      order: { stageOrder: 'DESC' },
    });

    const stage = this.productionStageRepository.create({
      productionId: production.id,
      stageName: dto.stageName,
      stageOrder: dto.stageOrder ?? (lastStage?.stageOrder ?? 0) + 1,
      notes: dto.notes,
      status: CustomProductionStageStatus.PENDING,
    });
    const saved = await this.productionStageRepository.save(stage);

    await this.recordHistory(
      req,
      id,
      'PRODUCTION_STAGE_ADDED',
      `Production stage "${dto.stageName}" added to custom order ${order.orderCode}`,
    );
    await this.adminAuditService.log(
      req,
      'CUSTOM_ORDERS',
      'PRODUCTION_STAGE_ADDED',
      'CustomProductionStage',
      saved.id,
      `Added stage "${dto.stageName}" to custom order ${order.orderCode}`,
      undefined,
      saved,
    );

    return { message: 'Production stage added successfully', stage: saved };
  }

  // PENDING -> IN_PROGRESS -> COMPLETED (stage progression).
  async updateProductionStageStatus(
    stageId: string,
    dto: UpdateProductionStageStatusDto,
    req: AdminRequest,
  ) {
    const stage = await this.productionStageRepository.findOne({
      where: { id: stageId },
      relations: { production: true },
    });
    if (!stage) {
      throw new NotFoundException('Production stage not found');
    }

    // Forward-only progression: PENDING -> IN_PROGRESS -> COMPLETED, with
    // SKIPPED reachable from PENDING/IN_PROGRESS. Terminal states are locked.
    const stageTransitions: Record<
      CustomProductionStageStatus,
      CustomProductionStageStatus[]
    > = {
      [CustomProductionStageStatus.PENDING]: [
        CustomProductionStageStatus.IN_PROGRESS,
        CustomProductionStageStatus.SKIPPED,
      ],
      [CustomProductionStageStatus.IN_PROGRESS]: [
        CustomProductionStageStatus.COMPLETED,
        CustomProductionStageStatus.SKIPPED,
      ],
      [CustomProductionStageStatus.COMPLETED]: [],
      [CustomProductionStageStatus.SKIPPED]: [],
    };
    if (!(stageTransitions[stage.status] ?? []).includes(dto.status)) {
      throw new BadRequestException(
        `Cannot move stage from ${stage.status} to ${dto.status}`,
      );
    }

    const oldValue = { ...stage };
    if (dto.status === CustomProductionStageStatus.IN_PROGRESS) {
      stage.startedAt = stage.startedAt ?? new Date();
    } else if (dto.status === CustomProductionStageStatus.COMPLETED) {
      stage.completedAt = new Date();
    }
    stage.status = dto.status;
    stage.notes = dto.notes ?? stage.notes;
    const saved = await this.productionStageRepository.save(stage);

    await this.recordHistory(
      req,
      stage.production.orderId,
      'PRODUCTION_STAGE_UPDATED',
      `Stage "${stage.stageName}" marked ${dto.status}`,
    );
    await this.adminAuditService.log(
      req,
      'CUSTOM_ORDERS',
      'PRODUCTION_STAGE_UPDATED',
      'CustomProductionStage',
      saved.id,
      `Stage "${stage.stageName}" marked ${dto.status}`,
      oldValue,
      saved,
    );

    return { message: 'Production stage updated successfully', stage: saved };
  }

  // ---------- DELIVERY ----------

  // IN_PRODUCTION -> READY_FOR_DELIVERY. Schedules (or re-schedules) delivery.
  async scheduleDelivery(
    id: string,
    dto: ScheduleCustomDeliveryDto,
    req: AdminRequest,
  ) {
    const order = await this.getOrderOrThrow(id);
    this.assertOrderStatus(
      order,
      [CustomOrderStatus.IN_PRODUCTION, CustomOrderStatus.READY_FOR_DELIVERY],
      'scheduled for delivery',
    );

    const existing = await this.deliveryRepository.findOne({
      where: { orderId: id, status: CustomDeliveryScheduleStatus.SCHEDULED },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let delivery: CustomDeliverySchedule;
    try {
      if (existing) {
        existing.scheduledDate = new Date(dto.scheduledDate);
        existing.deliveryAddress = dto.deliveryAddress;
        existing.contactName = dto.contactName;
        existing.contactPhone = dto.contactPhone;
        existing.remarks = dto.remarks;
        delivery = await queryRunner.manager.save(existing);
      } else {
        delivery = await queryRunner.manager.save(
          queryRunner.manager.create(CustomDeliverySchedule, {
            orderId: id,
            scheduledDate: new Date(dto.scheduledDate),
            deliveryAddress: dto.deliveryAddress,
            contactName: dto.contactName,
            contactPhone: dto.contactPhone,
            remarks: dto.remarks,
            status: CustomDeliveryScheduleStatus.SCHEDULED,
            scheduledBy: req.user.id,
          }),
        );
      }

      if (order.status !== CustomOrderStatus.READY_FOR_DELIVERY) {
        order.status = CustomOrderStatus.READY_FOR_DELIVERY;
        order.updatedBy = req.user.id;
        await queryRunner.manager.save(order);
      }

      await queryRunner.manager.save(
        queryRunner.manager.create(CustomOrderHistory, {
          orderId: id,
          action: 'DELIVERY_SCHEDULED',
          description: `Delivery scheduled for custom order ${order.orderCode} on ${dto.scheduledDate}`,
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
      'CUSTOM_ORDERS',
      'DELIVERY_SCHEDULED',
      'CustomDeliverySchedule',
      delivery.id,
      `Scheduled delivery for custom order ${order.orderCode} on ${dto.scheduledDate}`,
      existing ?? undefined,
      delivery,
    );

    return { message: 'Delivery scheduled successfully', delivery };
  }

  // ---------- PRINT SERVICES + PRINT JOBS ----------

  async findPrintServices() {
    return this.printServiceRepository.find({
      where: { status: PrintServiceStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async createPrintService(dto: CreatePrintServiceDto, req: AdminRequest) {
    const service = this.printServiceRepository.create({
      ...cleanDto(dto),
    });
    const saved = await this.printServiceRepository.save(service);

    // Seed a default per-copy pricing row so the pricing entity is usable
    if (dto.pricePerPage !== undefined) {
      await this.printPricingRepository.save(
        this.printPricingRepository.create({
          serviceId: saved.id,
          pricePerPage: dto.pricePerPage,
          pricePerCopy: dto.pricePerPage,
          minQuantity: dto.minOrder ?? 1,
        }),
      );
    }

    await this.adminAuditService.log(
      req,
      'CUSTOM_ORDERS',
      'PRINT_SERVICE_CREATED',
      'PrintService',
      saved.id,
      `Created print service "${saved.name}"`,
      undefined,
      saved,
    );

    return { message: 'Print service created successfully', service: saved };
  }

  async findAllPrintJobs(query: ListPrintJobQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.serviceId) where.serviceId = query.serviceId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['jobCode'],
      sortableFields: [
        'jobCode',
        'quantity',
        'totalAmount',
        'status',
        'createdAt',
      ],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.printJobRepository.findAndCount({
      ...options,
      relations: { service: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createPrintJob(dto: CreatePrintJobDto, req: AdminRequest) {
    if (dto.serviceId) {
      const service = await this.printServiceRepository.findOne({
        where: { id: dto.serviceId },
      });
      if (!service) {
        throw new BadRequestException(
          'Invalid serviceId: print service not found',
        );
      }
    }

    const job = this.printJobRepository.create({
      ...cleanDto(dto),
      jobCode: this.nextCode('PJ'),
      status: PrintJobStatus.PENDING,
      startedBy: req.user.id,
    });
    const saved = await this.printJobRepository.save(job);

    await this.adminAuditService.log(
      req,
      'CUSTOM_ORDERS',
      'PRINT_JOB_CREATED',
      'PrintJob',
      saved.id,
      `Created print job ${saved.jobCode}`,
      undefined,
      saved,
    );

    return { message: 'Print job created successfully', job: saved };
  }

  async updatePrintJobStatus(
    id: string,
    dto: UpdatePrintJobStatusDto,
    req: AdminRequest,
  ) {
    const job = await this.printJobRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException('Print job not found');
    }
    this.assertPrintJobStatusTransition(job.status, dto.status);

    const oldValue = { ...job };
    job.status = dto.status;
    if (dto.status === PrintJobStatus.IN_PRODUCTION) {
      job.startedAt = job.startedAt ?? new Date();
    } else if (dto.status === PrintJobStatus.COMPLETED) {
      job.completedAt = new Date();
    }
    job.remarks = dto.remarks ?? job.remarks;
    const saved = await this.printJobRepository.save(job);

    await this.adminAuditService.log(
      req,
      'CUSTOM_ORDERS',
      'PRINT_JOB_STATUS_UPDATE',
      'PrintJob',
      saved.id,
      `Print job ${saved.jobCode} marked ${dto.status}`,
      oldValue,
      saved,
    );

    return { message: 'Print job status updated', job: saved };
  }

  // ---------- ANALYTICS + REPORTS ----------

  // Pre-computed analytics rows (populated by BI jobs).
  async findAllAnalytics(query: ListCustomAnalyticsQueryDto) {
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

  async findAllReports(query: ListCustomReportQueryDto) {
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
      throw new NotFoundException('Custom order not found');
    }
    return order;
  }

  private assertOrderStatus(
    order: CustomOrder,
    allowed: CustomOrderStatus[],
    action: string,
  ) {
    if (!allowed.includes(order.status)) {
      throw new BadRequestException(
        `Custom order cannot be ${action} in its current status (${order.status})`,
      );
    }
  }

  // Guards forward-only movement through the order pipeline. CANCELLED is
  // reachable from every active state; DELIVERED only from READY_FOR_DELIVERY.
  private assertOrderStatusTransition(
    current: CustomOrderStatus,
    target: CustomOrderStatus,
  ) {
    const transitions: Record<CustomOrderStatus, CustomOrderStatus[]> = {
      [CustomOrderStatus.PENDING_QUOTATION]: [
        CustomOrderStatus.QUOTATION_SENT,
        CustomOrderStatus.CANCELLED,
      ],
      [CustomOrderStatus.QUOTATION_SENT]: [
        CustomOrderStatus.QUOTATION_APPROVED,
        CustomOrderStatus.QUOTATION_REJECTED,
        CustomOrderStatus.CANCELLED,
      ],
      [CustomOrderStatus.QUOTATION_REJECTED]: [
        CustomOrderStatus.QUOTATION_SENT,
        CustomOrderStatus.CANCELLED,
      ],
      // IN_PRODUCTION is intentionally NOT in the generic map: only the
      // dedicated startProduction endpoint creates the CustomProduction
      // record, so the status must not be reachable via the generic PATCH.
      [CustomOrderStatus.QUOTATION_APPROVED]: [CustomOrderStatus.CANCELLED],
      [CustomOrderStatus.IN_PRODUCTION]: [
        CustomOrderStatus.READY_FOR_DELIVERY,
        CustomOrderStatus.CANCELLED,
      ],
      [CustomOrderStatus.READY_FOR_DELIVERY]: [
        CustomOrderStatus.DELIVERED,
        CustomOrderStatus.CANCELLED,
      ],
      [CustomOrderStatus.DELIVERED]: [],
      [CustomOrderStatus.CANCELLED]: [],
    };

    const allowed = transitions[current] ?? [];
    if (!allowed.includes(target)) {
      throw new BadRequestException(`Cannot move from ${current} to ${target}`);
    }
  }

  // Guards forward-only movement through the print-job pipeline.
  private assertPrintJobStatusTransition(
    current: PrintJobStatus,
    target: PrintJobStatus,
  ) {
    const transitions: Record<PrintJobStatus, PrintJobStatus[]> = {
      [PrintJobStatus.PENDING]: [
        PrintJobStatus.IN_PRODUCTION,
        PrintJobStatus.CANCELLED,
      ],
      [PrintJobStatus.IN_PRODUCTION]: [
        PrintJobStatus.COMPLETED,
        PrintJobStatus.CANCELLED,
      ],
      [PrintJobStatus.COMPLETED]: [PrintJobStatus.DELIVERED],
      [PrintJobStatus.DELIVERED]: [],
      [PrintJobStatus.CANCELLED]: [],
    };

    const allowed = transitions[current] ?? [];
    if (!allowed.includes(target)) {
      throw new BadRequestException(`Cannot move from ${current} to ${target}`);
    }
  }

  private async recordHistory(
    req: AdminRequest,
    orderId: string,
    action: string,
    description: string,
  ) {
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
