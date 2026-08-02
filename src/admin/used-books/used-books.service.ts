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
import { ListUsedBookRequestQueryDto } from './dto/list-used-book-request-query.dto';
import { ReviewUsedBookRequestDto } from './dto/review-used-book-request.dto';
import { GenerateOfferDto } from './dto/generate-offer.dto';
import { ApproveOfferDto } from './dto/approve-offer.dto';
import { SchedulePickupDto } from './dto/schedule-pickup.dto';
import { InspectItemDto } from './dto/inspect-item.dto';
import { RepriceItemDto } from './dto/reprice-item.dto';
import { PublishItemDto } from './dto/publish-item.dto';
import { ListAuditLogQueryDto } from './dto/list-audit-log-query.dto';
import { ListUsedBookAnalyticsQueryDto } from './dto/list-used-book-analytics-query.dto';
import {
  UsedBookSellRequest,
  UsedBookSellRequestStatus,
  UsedBookItem,
  UsedBookItemStatus,
  UsedBookEvaluation,
  UsedBookOffer,
  UsedBookOfferStatus,
  UsedBookApproval,
  UsedBookApprovalStatus,
  UsedBookPickup,
  UsedBookPickupStatus,
  UsedBookInspection,
  UsedBookInspectionDecision,
  UsedBookInventory,
  UsedBookPricing,
  UsedBookResale,
  UsedBookResaleStatus,
  UsedBookHistory,
  UsedBookConditionReport,
  UsedBookRepair,
  UsedBookRepairStatus,
  UsedBookRejectReason,
  UsedBookRejectReasonStatus,
  UsedBookReturn,
  UsedBookReturnStatus,
  UsedBookAnalytics,
} from './entities';

// Buyback pipeline (item level):
//   PENDING_EVALUATION -> OFFERED -> APPROVED -> (pickup) -> INSPECTED
//     -> READY_FOR_RESALE -> PUBLISHED
//   Rejection / repair branches: OFFERED -> REJECTED,
//   APPROVED -> REPAIRING (-> INSPECTED after re-inspection), APPROVED -> REJECTED.
// Request level: PENDING_REVIEW -> ACCEPTED | REJECTED.
// Every step records a UsedBookHistory row (domain timeline, also exposed as
// the module's audit trail) plus a global audit entry via AdminAuditService.
@Injectable()
export class UsedBooksService {
  constructor(
    @InjectRepository(UsedBookSellRequest)
    private readonly requestRepository: Repository<UsedBookSellRequest>,
    @InjectRepository(UsedBookItem)
    private readonly itemRepository: Repository<UsedBookItem>,
    @InjectRepository(UsedBookEvaluation)
    private readonly evaluationRepository: Repository<UsedBookEvaluation>,
    @InjectRepository(UsedBookOffer)
    private readonly offerRepository: Repository<UsedBookOffer>,
    @InjectRepository(UsedBookApproval)
    private readonly approvalRepository: Repository<UsedBookApproval>,
    @InjectRepository(UsedBookPickup)
    private readonly pickupRepository: Repository<UsedBookPickup>,
    @InjectRepository(UsedBookInspection)
    private readonly inspectionRepository: Repository<UsedBookInspection>,
    @InjectRepository(UsedBookInventory)
    private readonly inventoryRepository: Repository<UsedBookInventory>,
    @InjectRepository(UsedBookPricing)
    private readonly pricingRepository: Repository<UsedBookPricing>,
    @InjectRepository(UsedBookResale)
    private readonly resaleRepository: Repository<UsedBookResale>,
    @InjectRepository(UsedBookHistory)
    private readonly historyRepository: Repository<UsedBookHistory>,
    @InjectRepository(UsedBookConditionReport)
    private readonly conditionReportRepository: Repository<UsedBookConditionReport>,
    @InjectRepository(UsedBookRepair)
    private readonly repairRepository: Repository<UsedBookRepair>,
    @InjectRepository(UsedBookRejectReason)
    private readonly rejectReasonRepository: Repository<UsedBookRejectReason>,
    @InjectRepository(UsedBookReturn)
    private readonly returnRepository: Repository<UsedBookReturn>,
    @InjectRepository(UsedBookAnalytics)
    private readonly analyticsRepository: Repository<UsedBookAnalytics>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- SELL REQUESTS ----------

  async findAllRequests(query: ListUsedBookRequestQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['requestCode'],
      sortableFields: ['requestCode', 'status', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.requestRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRequestById(id: string) {
    const request = await this.requestRepository.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Used book sell request not found');
    }

    const items = await this.itemRepository.find({
      where: { requestId: id },
      order: { createdAt: 'ASC' },
    });
    const history = await this.historyRepository.find({
      where: { requestId: id },
      order: { createdAt: 'DESC' },
      take: 100,
    });
    return { ...request, items, history };
  }

  // PENDING_REVIEW -> ACCEPTED | REJECTED. A rejection must carry a reject
  // reason (when provided) and moves every item of the request to REJECTED.
  async reviewRequest(
    id: string,
    dto: ReviewUsedBookRequestDto,
    req: AdminRequest,
  ) {
    const request = await this.requestRepository.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Used book sell request not found');
    }
    const items = await this.itemRepository.find({ where: { requestId: id } });
    this.assertRequestStatus(
      request,
      [UsedBookSellRequestStatus.PENDING_REVIEW],
      'reviewed',
    );

    if (
      dto.status === UsedBookSellRequestStatus.REJECTED &&
      dto.rejectReasonId
    ) {
      const reason = await this.rejectReasonRepository.findOne({
        where: { id: dto.rejectReasonId },
      });
      if (!reason) {
        throw new BadRequestException(
          'Invalid rejectReasonId: reject reason not found',
        );
      }
    }

    const oldValue = { ...request };
    const isAccepted = dto.status === UsedBookSellRequestStatus.ACCEPTED;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      request.status = dto.status;
      request.reviewedBy = req.user.id;
      request.reviewedAt = new Date();
      // null (not undefined) so TypeORM clears the column on re-review
      request.rejectReasonId = isAccepted ? null : dto.rejectReasonId;
      await queryRunner.manager.save(request);

      if (!isAccepted) {
        // Rejecting the request rejects all its items too
        for (const item of items) {
          item.status = UsedBookItemStatus.REJECTED;
          await queryRunner.manager.save(item);
        }
      }

      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookHistory, {
          requestId: id,
          action: isAccepted ? 'REQUEST_ACCEPTED' : 'REQUEST_REJECTED',
          description: isAccepted
            ? `Sell request ${request.requestCode} accepted`
            : `Sell request ${request.requestCode} rejected${
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
      'USED_BOOKS',
      isAccepted ? 'REQUEST_ACCEPTED' : 'REQUEST_REJECTED',
      'UsedBookSellRequest',
      id,
      `${isAccepted ? 'Accepted' : 'Rejected'} sell request ${request.requestCode}`,
      oldValue,
      request,
    );

    return {
      message: isAccepted ? 'Sell request accepted' : 'Sell request rejected',
      request,
    };
  }

  // ---------- EVALUATION + OFFER ----------

  // PENDING_EVALUATION -> OFFERED. Creates the evaluation record and the
  // offer derived from it in one transaction.
  async generateOffer(
    itemId: string,
    dto: GenerateOfferDto,
    req: AdminRequest,
  ) {
    const item = await this.getItemOrThrow(itemId);
    this.assertItemStatus(
      item,
      [UsedBookItemStatus.PENDING_EVALUATION],
      'offered',
    );
    const request = await this.getRequestOrThrow(item.requestId);

    const oldValue = { ...item };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookEvaluation, {
          itemId,
          evaluatedBy: req.user.id,
          conditionGrade: dto.conditionGrade,
          estimatedPrice: dto.estimatedPrice,
          remarks: dto.remarks,
          evaluatedAt: new Date(),
        }),
      );

      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookOffer, {
          itemId,
          offerAmount: dto.offerAmount,
          status: UsedBookOfferStatus.PENDING,
          offeredBy: req.user.id,
          offeredAt: new Date(),
        }),
      );

      item.status = UsedBookItemStatus.OFFERED;
      await queryRunner.manager.save(item);

      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookHistory, {
          requestId: item.requestId,
          itemId,
          action: 'OFFER_GENERATED',
          description: `Offer ${dto.offerAmount} generated for "${item.title}" (estimated ${dto.estimatedPrice}, ${dto.conditionGrade})`,
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
      'USED_BOOKS',
      'OFFER_GENERATED',
      'UsedBookItem',
      itemId,
      `Generated offer ${dto.offerAmount} for "${item.title}" (request ${request.requestCode})`,
      oldValue,
      item,
    );

    return { message: 'Offer generated successfully', item };
  }

  // OFFERED -> APPROVED | REJECTED. Records the internal approval decision on
  // the item's latest pending offer.
  async approveOffer(itemId: string, dto: ApproveOfferDto, req: AdminRequest) {
    const item = await this.getItemOrThrow(itemId);
    this.assertItemStatus(item, [UsedBookItemStatus.OFFERED], 'approved');

    const offer = dto.offerId
      ? await this.offerRepository.findOne({ where: { id: dto.offerId } })
      : await this.offerRepository.findOne({
          where: { itemId, status: UsedBookOfferStatus.PENDING },
          order: { createdAt: 'DESC' },
        });
    if (!offer) {
      throw new BadRequestException(
        dto.offerId
          ? 'Invalid offerId: offer not found'
          : 'No pending offer exists for this item',
      );
    }
    if (offer.itemId !== itemId) {
      throw new BadRequestException('Offer does not belong to this item');
    }
    if (offer.status !== UsedBookOfferStatus.PENDING) {
      throw new BadRequestException('Offer has already been responded to');
    }

    const oldValue = { ...item };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookApproval, {
          itemId,
          offerId: offer.id,
          requestedBy: req.user.id,
          approvedBy: req.user.id,
          status: dto.approved
            ? UsedBookApprovalStatus.APPROVED
            : UsedBookApprovalStatus.REJECTED,
          remarks: dto.remarks,
          approvedAt: new Date(),
        }),
      );

      offer.status = dto.approved
        ? UsedBookOfferStatus.ACCEPTED
        : UsedBookOfferStatus.DECLINED;
      offer.respondedAt = new Date();
      await queryRunner.manager.save(offer);

      item.status = dto.approved
        ? UsedBookItemStatus.APPROVED
        : UsedBookItemStatus.REJECTED;
      await queryRunner.manager.save(item);

      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookHistory, {
          requestId: item.requestId,
          itemId,
          action: dto.approved ? 'OFFER_APPROVED' : 'OFFER_DECLINED',
          description: `${dto.approved ? 'Approved' : 'Declined'} offer ${offer.offerAmount} for "${item.title}"${
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
      'USED_BOOKS',
      dto.approved ? 'OFFER_APPROVED' : 'OFFER_DECLINED',
      'UsedBookItem',
      itemId,
      `${dto.approved ? 'Approved' : 'Declined'} offer ${offer.offerAmount} for "${item.title}"`,
      oldValue,
      item,
    );

    return {
      message: dto.approved
        ? 'Offer approved — item moves to pickup'
        : 'Offer declined',
      item,
    };
  }

  // ---------- PICKUP ----------

  // Schedules (or re-schedules) the pickup for a sell request. The :id in
  // POST /admin/used-books/pickups/:id/schedule is the sell request id; an
  // existing SCHEDULED pickup is updated instead of duplicated.
  async schedulePickup(
    requestId: string,
    dto: SchedulePickupDto,
    req: AdminRequest,
  ) {
    const request = await this.getRequestOrThrow(requestId);
    this.assertRequestStatus(
      request,
      [UsedBookSellRequestStatus.ACCEPTED],
      'scheduled for pickup',
    );

    const existing = await this.pickupRepository.findOne({
      where: { requestId, status: UsedBookPickupStatus.SCHEDULED },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let pickup: UsedBookPickup;
    try {
      if (existing) {
        existing.scheduledAt = new Date(dto.scheduledAt);
        existing.address = dto.address;
        existing.contactName = dto.contactName;
        existing.contactPhone = dto.contactPhone;
        existing.remarks = dto.remarks;
        pickup = await queryRunner.manager.save(existing);
      } else {
        pickup = await queryRunner.manager.save(
          queryRunner.manager.create(UsedBookPickup, {
            requestId,
            scheduledAt: new Date(dto.scheduledAt),
            address: dto.address,
            contactName: dto.contactName,
            contactPhone: dto.contactPhone,
            remarks: dto.remarks,
            status: UsedBookPickupStatus.SCHEDULED,
            scheduledBy: req.user.id,
          }),
        );
      }

      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookHistory, {
          requestId,
          action: 'PICKUP_SCHEDULED',
          description: `Pickup scheduled for ${request.requestCode} on ${dto.scheduledAt} at ${dto.address}`,
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
      'USED_BOOKS',
      'PICKUP_SCHEDULED',
      'UsedBookPickup',
      pickup.id,
      `Scheduled pickup for ${request.requestCode} on ${dto.scheduledAt}`,
      existing ?? undefined,
      pickup,
    );

    return { message: 'Pickup scheduled successfully', pickup };
  }

  // ---------- INSPECTION + REPAIR DECISION ----------

  // APPROVED | REPAIRING -> INSPECTED | REPAIRING | REJECTED. Creates the
  // inspection record + condition report; a REPAIR decision also opens a
  // repair record, a REJECT decision creates the return record.
  async inspectItem(itemId: string, dto: InspectItemDto, req: AdminRequest) {
    const item = await this.getItemOrThrow(itemId);
    this.assertItemStatus(
      item,
      [UsedBookItemStatus.APPROVED, UsedBookItemStatus.REPAIRING],
      'inspected',
    );
    const request = await this.getRequestOrThrow(item.requestId);

    const oldValue = { ...item };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookInspection, {
          itemId,
          inspectedBy: req.user.id,
          inspectionDate: new Date(),
          conditionGrade: dto.conditionGrade,
          repairNeeded:
            dto.repairNeeded ??
            dto.decision === UsedBookInspectionDecision.REPAIR,
          decision: dto.decision,
          remarks: dto.remarks,
          inspectedAt: new Date(),
        }),
      );

      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookConditionReport, {
          itemId,
          reportNumber: this.nextCode('UBCR'),
          overallGrade: dto.conditionGrade,
          remarks: dto.remarks,
        }),
      );

      if (dto.decision === UsedBookInspectionDecision.ACCEPT) {
        item.status = UsedBookItemStatus.INSPECTED;
      } else if (dto.decision === UsedBookInspectionDecision.REPAIR) {
        item.status = UsedBookItemStatus.REPAIRING;
        await queryRunner.manager.save(
          queryRunner.manager.create(UsedBookRepair, {
            itemId,
            repairType: dto.repairType,
            cost: dto.repairCost ?? 0,
            description: dto.repairDescription,
            status: UsedBookRepairStatus.PENDING,
            performedBy: req.user.id,
          }),
        );
      } else {
        item.status = UsedBookItemStatus.REJECTED;
        await queryRunner.manager.save(
          queryRunner.manager.create(UsedBookReturn, {
            itemId,
            requestId: item.requestId,
            reason: dto.remarks ?? 'Rejected after inspection',
            status: UsedBookReturnStatus.REQUESTED,
          }),
        );
      }
      await queryRunner.manager.save(item);

      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookHistory, {
          requestId: item.requestId,
          itemId,
          action: `ITEM_${dto.decision}`,
          description: `Inspection decision ${dto.decision} for "${item.title}" (grade ${dto.conditionGrade})${
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
      'USED_BOOKS',
      `ITEM_${dto.decision}`,
      'UsedBookItem',
      itemId,
      `Inspection ${dto.decision} for "${item.title}" (request ${request.requestCode})`,
      oldValue,
      item,
    );

    return { message: `Item ${dto.decision.toLowerCase()}`, item };
  }

  // ---------- PRICING + PUBLISH TO RESALE ----------

  // INSPECTED | REPAIRING -> READY_FOR_RESALE. Stores the resale price.
  async repriceItem(itemId: string, dto: RepriceItemDto, req: AdminRequest) {
    const item = await this.getItemOrThrow(itemId);
    this.assertItemStatus(
      item,
      [UsedBookItemStatus.INSPECTED, UsedBookItemStatus.REPAIRING],
      'repriced',
    );
    const request = await this.getRequestOrThrow(item.requestId);

    const oldValue = { ...item };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookPricing, {
          itemId,
          basePrice: dto.basePrice,
          sellingPrice: dto.sellingPrice,
          discount: dto.discount ?? 0,
          setBy: req.user.id,
          setAt: new Date(),
        }),
      );

      item.status = UsedBookItemStatus.READY_FOR_RESALE;
      await queryRunner.manager.save(item);

      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookHistory, {
          requestId: item.requestId,
          itemId,
          action: 'ITEM_REPRICED',
          description: `"${item.title}" repriced at ${dto.sellingPrice}`,
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
      'USED_BOOKS',
      'ITEM_REPRICED',
      'UsedBookItem',
      itemId,
      `Repriced "${item.title}" at ${dto.sellingPrice} (request ${request.requestCode})`,
      oldValue,
      item,
    );

    return { message: 'Item repriced successfully', item };
  }

  // READY_FOR_RESALE -> PUBLISHED. Creates the inventory record + resale
  // listing atomically.
  async publishItem(itemId: string, dto: PublishItemDto, req: AdminRequest) {
    const item = await this.getItemOrThrow(itemId);
    this.assertItemStatus(
      item,
      [UsedBookItemStatus.READY_FOR_RESALE],
      'published',
    );
    const request = await this.getRequestOrThrow(item.requestId);

    const oldValue = { ...item };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let resale: UsedBookResale;
    try {
      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookInventory, {
          itemId,
          warehouseId: dto.warehouseId,
          location: dto.location,
          quantity: dto.quantity ?? 1,
          receivedAt: new Date(),
        }),
      );

      resale = await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookResale, {
          itemId,
          listingCode: this.nextCode('UBR'),
          status: UsedBookResaleStatus.LISTED,
          listedBy: req.user.id,
          listedAt: new Date(),
        }),
      );

      item.status = UsedBookItemStatus.PUBLISHED;
      await queryRunner.manager.save(item);

      await queryRunner.manager.save(
        queryRunner.manager.create(UsedBookHistory, {
          requestId: item.requestId,
          itemId,
          action: 'ITEM_PUBLISHED',
          description: `"${item.title}" published to resale as ${resale.listingCode}`,
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
      'USED_BOOKS',
      'ITEM_PUBLISHED',
      'UsedBookItem',
      itemId,
      `Published "${item.title}" to resale as ${resale.listingCode} (request ${request.requestCode})`,
      oldValue,
      item,
    );

    return { message: 'Item published to resale', resale, item };
  }

  // ---------- REJECT REASONS + AUDIT TRAIL ----------

  async findRejectReasons() {
    return this.rejectReasonRepository.find({
      where: { status: UsedBookRejectReasonStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  // The UsedBookHistory rows are the module's audit trail (who did what, on
  // which request/item, when). Global before/after audit entries live in the
  // RBAC AuditLog (see /admin/rbac/audit-logs).
  async findAuditLogs(query: ListAuditLogQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.action) where.action = query.action;
    if (query.requestId) where.requestId = query.requestId;
    if (query.itemId) where.itemId = query.itemId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['description'],
      sortableFields: ['action', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.historyRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- ANALYTICS ----------

  // Aggregated used-book metrics (requests, offers, conversions, avg offer
  // amounts) produced by reporting/BI jobs — admin read-only oversight.
  async findAnalytics(query: ListUsedBookAnalyticsQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.period) where.period = query.period;
    if (query.metric) where.metric = query.metric;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['period', 'metric'],
      sortableFields: ['period', 'metric', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.analyticsRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- PRIVATE HELPERS ----------

  private async getRequestOrThrow(id: string) {
    const request = await this.requestRepository.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Used book sell request not found');
    }
    return request;
  }

  private async getItemOrThrow(id: string) {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Used book item not found');
    }
    return item;
  }

  private assertRequestStatus(
    request: UsedBookSellRequest,
    allowed: UsedBookSellRequestStatus[],
    action: string,
  ) {
    if (!allowed.includes(request.status)) {
      throw new BadRequestException(
        `Sell request cannot be ${action} in its current status (${request.status})`,
      );
    }
  }

  private assertItemStatus(
    item: UsedBookItem,
    allowed: UsedBookItemStatus[],
    action: string,
  ) {
    if (!allowed.includes(item.status)) {
      throw new BadRequestException(
        `Item cannot be ${action} in its current status (${item.status})`,
      );
    }
  }

  private nextCode(prefix: string): string {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
  }
}
