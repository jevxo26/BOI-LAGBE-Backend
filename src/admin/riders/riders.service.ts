import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '../../auth/entities';
import { Area } from '../areas/entities';
import { ApprovalStatus, DocumentVerificationStatus } from '../agents/entities';
import { QueryBuilder } from '../common/utils/query-builder';
import { cleanDto } from '../common/utils/dto.util';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { PaginatedQueryDto } from '../common/dto/paginated-query.dto';
import { ListRiderQueryDto } from './dto/list-rider-query.dto';
import { CreateRiderDto } from './dto/create-rider.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';
import { UpdateRiderStatusDto } from './dto/update-rider-status.dto';
import { AssignRiderAreasDto } from './dto/assign-rider-areas.dto';
import { ListRiderDocumentQueryDto } from './dto/list-rider-document-query.dto';
import { VerifyRiderDocumentDto } from './dto/verify-rider-document.dto';
import { ListRiderVehicleQueryDto } from './dto/list-rider-vehicle-query.dto';
import { ListRiderRouteQueryDto } from './dto/list-rider-route-query.dto';
import { ListRiderAvailabilityQueryDto } from './dto/list-rider-availability-query.dto';
import { ListRiderShiftQueryDto } from './dto/list-rider-shift-query.dto';
import { ListRiderAttendanceQueryDto } from './dto/list-rider-attendance-query.dto';
import { ListRiderAssignmentQueryDto } from './dto/list-rider-assignment-query.dto';
import { ListRiderDeliveryQueryDto } from './dto/list-rider-delivery-query.dto';
import { ListRiderOtpQueryDto } from './dto/list-rider-otp-query.dto';
import { ListRiderProofQueryDto } from './dto/list-rider-proof-query.dto';
import { ListRiderEarningQueryDto } from './dto/list-rider-earning-query.dto';
import { ListRiderSettlementQueryDto } from './dto/list-rider-settlement-query.dto';
import { ListRiderWalletTransactionQueryDto } from './dto/list-rider-wallet-transaction-query.dto';
import { ListRiderPerformanceQueryDto } from './dto/list-rider-performance-query.dto';
import { ListRiderIncidentQueryDto } from './dto/list-rider-incident-query.dto';
import { ListRiderNotificationQueryDto } from './dto/list-rider-notification-query.dto';
import { ListRiderLeaveQueryDto } from './dto/list-rider-leave-query.dto';
import { ApproveRiderLeaveDto } from './dto/approve-rider-leave.dto';
import { CreateRiderBonusDto } from './dto/create-rider-bonus.dto';
import { CreateRiderPenaltyDto } from './dto/create-rider-penalty.dto';
import { ListRiderHistoryQueryDto } from './dto/list-rider-history-query.dto';
import { ListRiderAnalyticsQueryDto } from './dto/list-rider-analytics-query.dto';
import { ListRiderReportQueryDto } from './dto/list-rider-report-query.dto';
import {
  Rider,
  RiderArea,
  RiderAreaStatus,
  RiderDocument,
  RiderVehicle,
  RiderRoute,
  RiderAvailability,
  RiderShift,
  RiderAttendance,
  RiderAssignment,
  RiderDelivery,
  RiderTracking,
  RiderLocationHistory,
  RiderOTP,
  RiderProof,
  RiderDeliveryAttempt,
  RiderEarning,
  RiderSettlement,
  RiderWallet,
  RiderWalletTransaction,
  RiderPenalty,
  RiderBonus,
  RiderRating,
  RiderPerformance,
  RiderIncident,
  RiderNotification,
  RiderAnnouncement,
  RiderLeave,
  RiderHistory,
  RiderAnalytics,
  RiderReport,
} from './entities';

@Injectable()
export class RidersService {
  constructor(
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @InjectRepository(RiderArea)
    private readonly riderAreaRepository: Repository<RiderArea>,
    @InjectRepository(RiderDocument)
    private readonly documentRepository: Repository<RiderDocument>,
    @InjectRepository(RiderVehicle)
    private readonly vehicleRepository: Repository<RiderVehicle>,
    @InjectRepository(RiderRoute)
    private readonly routeRepository: Repository<RiderRoute>,
    @InjectRepository(RiderAvailability)
    private readonly availabilityRepository: Repository<RiderAvailability>,
    @InjectRepository(RiderShift)
    private readonly shiftRepository: Repository<RiderShift>,
    @InjectRepository(RiderAttendance)
    private readonly attendanceRepository: Repository<RiderAttendance>,
    @InjectRepository(RiderAssignment)
    private readonly assignmentRepository: Repository<RiderAssignment>,
    @InjectRepository(RiderDelivery)
    private readonly deliveryRepository: Repository<RiderDelivery>,
    @InjectRepository(RiderTracking)
    private readonly trackingRepository: Repository<RiderTracking>,
    @InjectRepository(RiderLocationHistory)
    private readonly locationHistoryRepository: Repository<RiderLocationHistory>,
    @InjectRepository(RiderOTP)
    private readonly otpRepository: Repository<RiderOTP>,
    @InjectRepository(RiderProof)
    private readonly proofRepository: Repository<RiderProof>,
    @InjectRepository(RiderDeliveryAttempt)
    private readonly deliveryAttemptRepository: Repository<RiderDeliveryAttempt>,
    @InjectRepository(RiderEarning)
    private readonly earningRepository: Repository<RiderEarning>,
    @InjectRepository(RiderSettlement)
    private readonly settlementRepository: Repository<RiderSettlement>,
    @InjectRepository(RiderWallet)
    private readonly walletRepository: Repository<RiderWallet>,
    @InjectRepository(RiderWalletTransaction)
    private readonly walletTransactionRepository: Repository<RiderWalletTransaction>,
    @InjectRepository(RiderPenalty)
    private readonly penaltyRepository: Repository<RiderPenalty>,
    @InjectRepository(RiderBonus)
    private readonly bonusRepository: Repository<RiderBonus>,
    @InjectRepository(RiderRating)
    private readonly ratingRepository: Repository<RiderRating>,
    @InjectRepository(RiderPerformance)
    private readonly performanceRepository: Repository<RiderPerformance>,
    @InjectRepository(RiderIncident)
    private readonly incidentRepository: Repository<RiderIncident>,
    @InjectRepository(RiderNotification)
    private readonly notificationRepository: Repository<RiderNotification>,
    @InjectRepository(RiderAnnouncement)
    private readonly announcementRepository: Repository<RiderAnnouncement>,
    @InjectRepository(RiderLeave)
    private readonly leaveRepository: Repository<RiderLeave>,
    @InjectRepository(RiderHistory)
    private readonly historyRepository: Repository<RiderHistory>,
    @InjectRepository(RiderAnalytics)
    private readonly analyticsRepository: Repository<RiderAnalytics>,
    @InjectRepository(RiderReport)
    private readonly reportRepository: Repository<RiderReport>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- CORE CRUD ----------

  async findAllRiders(query: ListRiderQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.areaId) where.riderAreas = { areaId: query.areaId };

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['riderCode', 'fullName', 'phone', 'email'],
      sortableFields: ['createdAt', 'fullName', 'status'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.riderRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRiderById(id: string) {
    const rider = await this.riderRepository.findOne({
      where: { id },
      relations: { riderAreas: true },
    });
    if (!rider) {
      throw new NotFoundException('Rider not found');
    }
    return rider;
  }

  async createRider(dto: CreateRiderDto, req: AdminRequest) {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.riderRepository.findOne({
      where: { userId: dto.userId },
    });
    if (existing) {
      throw new BadRequestException('Rider already exists for this user');
    }

    const rider = this.riderRepository.create({
      ...cleanDto(dto),
      riderCode: this.generateRiderCode(),
      createdBy: req.user.id,
    });

    // Onboarding must be atomic: the rider row and the RIDER role grant on the
    // linked user are committed (or rolled back) together.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let saved: Rider;
    try {
      saved = await queryRunner.manager.save(rider);

      // Grant the RIDER role so the user can be authorized as a rider
      const roles = user.roles ?? [];
      if (!roles.includes('RIDER')) {
        roles.push('RIDER');
        await queryRunner.manager.save(User, { ...user, roles });
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
      'RIDERS',
      'CREATE',
      'Rider',
      saved.id,
      `Onboarded rider "${saved.fullName}"`,
      undefined,
      saved,
    );

    return { message: 'Rider onboarded successfully', rider: saved };
  }

  async updateRider(id: string, dto: UpdateRiderDto, req: AdminRequest) {
    const rider = await this.riderRepository.findOne({ where: { id } });
    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    const oldValue = { ...rider };
    Object.assign(rider, cleanDto(dto));
    const saved = await this.riderRepository.save(rider);

    await this.adminAuditService.log(
      req,
      'RIDERS',
      'UPDATE',
      'Rider',
      saved.id,
      `Updated rider "${saved.fullName}"`,
      oldValue,
      saved,
    );

    return { message: 'Rider updated successfully', rider: saved };
  }

  async updateRiderStatus(
    id: string,
    dto: UpdateRiderStatusDto,
    req: AdminRequest,
  ) {
    const rider = await this.riderRepository.findOne({ where: { id } });
    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    const oldValue = { ...rider };
    rider.status = dto.status;
    const saved = await this.riderRepository.save(rider);

    await this.adminAuditService.log(
      req,
      'RIDERS',
      'UPDATE',
      'Rider',
      saved.id,
      `Updated rider status to ${saved.status}`,
      oldValue,
      saved,
    );

    return { message: 'Rider status updated successfully', rider: saved };
  }

  async assignRiderAreas(
    id: string,
    dto: AssignRiderAreasDto,
    req: AdminRequest,
  ) {
    const rider = await this.riderRepository.findOne({ where: { id } });
    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    const areas = await this.areaRepository.find({
      where: { id: In(dto.areaIds) },
    });
    if (areas.length !== dto.areaIds.length) {
      throw new BadRequestException('One or more area IDs are invalid');
    }

    const primaryAreaId =
      dto.primaryAreaId && dto.areaIds.includes(dto.primaryAreaId)
        ? dto.primaryAreaId
        : dto.areaIds[0];

    const rows = dto.areaIds.map((areaId) =>
      this.riderAreaRepository.create({
        riderId: id,
        areaId,
        isPrimary: areaId === primaryAreaId,
        assignedBy: req.user.id,
        assignedAt: new Date(),
        status: RiderAreaStatus.ACTIVE,
      }),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (dto.replaceExisting ?? true) {
        await queryRunner.manager.delete(RiderArea, { riderId: id });
      }
      await queryRunner.manager.save(rows);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.adminAuditService.log(
      req,
      'RIDERS',
      'ASSIGN',
      'RiderArea',
      id,
      `Assigned ${rows.length} area(s) to rider "${rider.fullName}"`,
      undefined,
      { riderId: id, areaIds: dto.areaIds, primaryAreaId },
    );

    return {
      message: 'Rider areas assigned successfully',
      assigned: rows.length,
    };
  }

  // ---------- DOCUMENTS ----------

  async findRiderDocuments(riderId: string, query: ListRiderDocumentQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.verificationStatus)
      where.verificationStatus = query.verificationStatus;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'documentType', 'verificationStatus'],
      where,
    });
    const [items, total] = await this.documentRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async verifyRiderDocument(
    documentId: string,
    dto: VerifyRiderDocumentDto,
    req: AdminRequest,
  ) {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException('Rider document not found');
    }

    const oldValue = { ...document };
    document.verificationStatus = dto.verificationStatus;
    if (dto.verificationStatus === DocumentVerificationStatus.APPROVED) {
      document.verifiedBy = req.user.id;
      document.verifiedAt = new Date();
    } else {
      // Reverting clears the stale verifier stamps. null (not undefined) so
      // TypeORM persists the clear — undefined is ignored on save.
      document.verifiedBy = null as unknown as string;
      document.verifiedAt = null as unknown as Date;
    }
    const saved = await this.documentRepository.save(document);

    await this.adminAuditService.log(
      req,
      'RIDERS',
      'DOCUMENT_VERIFIED',
      'RiderDocument',
      saved.id,
      `Document verification set to ${saved.verificationStatus}`,
      oldValue,
      saved,
    );

    return { message: 'Rider document verified successfully', document: saved };
  }

  // ---------- VEHICLES ----------

  async findRiderVehicles(riderId: string, query: ListRiderVehicleQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.vehicleType) where.vehicleType = query.vehicleType;
    if (query.status) where.status = query.status;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'status'],
      where,
    });
    const [items, total] = await this.vehicleRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- ROUTES ----------

  async findRiderRoutes(riderId: string, query: ListRiderRouteQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.status) where.status = query.status;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'name', 'status'],
      where,
    });
    const [items, total] = await this.routeRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- AVAILABILITY ----------

  async findRiderAvailability(
    riderId: string,
    query: ListRiderAvailabilityQueryDto,
  ) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.status) where.status = query.status;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'status'],
      where,
    });
    const [items, total] =
      await this.availabilityRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- SHIFTS ----------

  async findRiderShifts(riderId: string, query: ListRiderShiftQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.status) where.status = query.status;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'shiftDate', 'status'],
      where,
    });
    const [items, total] = await this.shiftRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- ATTENDANCE ----------

  async findRiderAttendance(
    riderId: string,
    query: ListRiderAttendanceQueryDto,
  ) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.status) where.status = query.status;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      sortableFields: ['createdAt', 'checkIn', 'checkOut'],
      where,
    });
    const [items, total] =
      await this.attendanceRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- ASSIGNMENTS ----------

  async findRiderAssignments(
    riderId: string,
    query: ListRiderAssignmentQueryDto,
  ) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.status) where.status = query.status;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'assignedAt', 'status'],
      where,
    });
    const [items, total] =
      await this.assignmentRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- DELIVERIES ----------

  async findRiderDeliveries(riderId: string, query: ListRiderDeliveryQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.status) where.status = query.status;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      sortableFields: ['createdAt', 'status', 'deliveredAt'],
      where,
    });
    const [items, total] = await this.deliveryRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- TRACKING / LOCATIONS / DELIVERY ATTEMPTS ----------

  async findRiderTracking(riderId: string, query: PaginatedQueryDto) {
    await this.getRiderOrThrow(riderId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'recordedAt'],
      where: { riderId },
    });
    const [items, total] = await this.trackingRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRiderLocationHistory(riderId: string, query: PaginatedQueryDto) {
    await this.getRiderOrThrow(riderId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'recordedAt'],
      where: { riderId },
    });
    const [items, total] =
      await this.locationHistoryRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRiderDeliveryAttempts(riderId: string, query: PaginatedQueryDto) {
    await this.getRiderOrThrow(riderId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'attemptNumber', 'result'],
      where: { riderId },
    });
    const [items, total] =
      await this.deliveryAttemptRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- OTP / PROOF ----------

  async findRiderOtps(riderId: string, query: ListRiderOtpQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.status) where.status = query.status;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'expiresAt', 'status'],
      where,
    });
    const [items, total] = await this.otpRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRiderProofs(riderId: string, query: ListRiderProofQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.proofType) where.proofType = query.proofType;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'proofType'],
      where,
    });
    const [items, total] = await this.proofRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- EARNINGS / SETTLEMENTS ----------

  async findRiderEarnings(riderId: string, query: ListRiderEarningQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.earningType) where.earningType = query.earningType;
    if (query.status) where.status = query.status;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'amount', 'status'],
      where,
    });
    const [items, total] = await this.earningRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRiderSettlements(
    riderId: string,
    query: ListRiderSettlementQueryDto,
  ) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'netAmount', 'paymentStatus'],
      where,
    });
    const [items, total] =
      await this.settlementRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- WALLET + TRANSACTIONS ----------

  async findRiderWallet(riderId: string) {
    await this.getRiderOrThrow(riderId);
    const wallet = await this.walletRepository.findOne({ where: { riderId } });
    if (!wallet) {
      throw new NotFoundException('Rider wallet not found');
    }
    return wallet;
  }

  async findRiderWalletTransactions(
    riderId: string,
    query: ListRiderWalletTransactionQueryDto,
  ) {
    await this.getRiderOrThrow(riderId);
    const wallet = await this.walletRepository.findOne({ where: { riderId } });
    if (!wallet) {
      throw new NotFoundException('Rider wallet not found');
    }
    const where: Record<string, unknown> = { walletId: wallet.id };
    if (query.transactionType) where.transactionType = query.transactionType;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'amount'],
      where,
    });
    const [items, total] =
      await this.walletTransactionRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- PENALTY / BONUS / RATING / PERFORMANCE ----------

  async findRiderPenalties(riderId: string, query: PaginatedQueryDto) {
    await this.getRiderOrThrow(riderId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'amount'],
      where: { riderId },
    });
    const [items, total] = await this.penaltyRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createRiderPenalty(
    riderId: string,
    dto: CreateRiderPenaltyDto,
    req: AdminRequest,
  ) {
    const rider = await this.getRiderOrThrow(riderId);
    const penalty = this.penaltyRepository.create({
      riderId,
      title: dto.title,
      amount: dto.amount,
      reason: dto.reason,
      approvedBy: req.user.id,
    });
    const saved = await this.penaltyRepository.save(penalty);

    await this.adminAuditService.log(
      req,
      'RIDERS',
      'PENALTY_APPLIED',
      'RiderPenalty',
      saved.id,
      `Applied penalty ${saved.amount} to rider "${rider.fullName}"`,
      undefined,
      saved,
    );

    return { message: 'Rider penalty applied successfully', penalty: saved };
  }

  async findRiderBonuses(riderId: string, query: PaginatedQueryDto) {
    await this.getRiderOrThrow(riderId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'amount'],
      where: { riderId },
    });
    const [items, total] = await this.bonusRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createRiderBonus(
    riderId: string,
    dto: CreateRiderBonusDto,
    req: AdminRequest,
  ) {
    const rider = await this.getRiderOrThrow(riderId);
    const bonus = this.bonusRepository.create({
      riderId,
      title: dto.title,
      amount: dto.amount,
      reason: dto.reason,
      approvedBy: req.user.id,
    });
    const saved = await this.bonusRepository.save(bonus);

    await this.adminAuditService.log(
      req,
      'RIDERS',
      'BONUS_GRANTED',
      'RiderBonus',
      saved.id,
      `Granted bonus ${saved.amount} to rider "${rider.fullName}"`,
      undefined,
      saved,
    );

    return { message: 'Rider bonus granted successfully', bonus: saved };
  }

  async findRiderRatings(riderId: string, query: PaginatedQueryDto) {
    await this.getRiderOrThrow(riderId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'rating'],
      where: { riderId },
    });
    const [items, total] = await this.ratingRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRiderPerformance(
    riderId: string,
    query: ListRiderPerformanceQueryDto,
  ) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.month) where.month = query.month;
    if (query.year) where.year = query.year;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'month', 'year', 'performanceScore'],
      where,
    });
    const [items, total] =
      await this.performanceRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- INCIDENTS / NOTIFICATIONS / ANNOUNCEMENTS / LEAVE ----------

  async findRiderIncidents(riderId: string, query: ListRiderIncidentQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.status) where.status = query.status;
    if (query.severity) where.severity = query.severity;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'status', 'severity'],
      where,
    });
    const [items, total] = await this.incidentRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRiderNotifications(
    riderId: string,
    query: ListRiderNotificationQueryDto,
  ) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.isRead !== undefined) where.isRead = query.isRead;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'title'],
      where,
    });
    const [items, total] =
      await this.notificationRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRiderAnnouncements(riderId: string, query: PaginatedQueryDto) {
    await this.getRiderOrThrow(riderId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'title'],
      where: { riderId },
    });
    const [items, total] =
      await this.announcementRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRiderLeaves(riderId: string, query: ListRiderLeaveQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.approvalStatus) where.approvalStatus = query.approvalStatus;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'startDate', 'approvalStatus'],
      where,
    });
    const [items, total] = await this.leaveRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async approveRiderLeave(
    leaveId: string,
    dto: ApproveRiderLeaveDto,
    req: AdminRequest,
  ) {
    const leave = await this.leaveRepository.findOne({
      where: { id: leaveId },
    });
    if (!leave) {
      throw new NotFoundException('Rider leave not found');
    }

    const oldValue = { ...leave };
    leave.approvalStatus = dto.approvalStatus;
    if (dto.approvalStatus === ApprovalStatus.PENDING) {
      // Reverting to PENDING clears the stale approver stamp. null (not
      // undefined) so TypeORM persists the clear — undefined is ignored on save.
      leave.approvedBy = null as unknown as string;
    } else {
      leave.approvedBy = req.user.id;
    }
    const saved = await this.leaveRepository.save(leave);

    await this.adminAuditService.log(
      req,
      'RIDERS',
      'LEAVE_APPROVAL',
      'RiderLeave',
      saved.id,
      `Rider leave marked ${saved.approvalStatus}`,
      oldValue,
      saved,
    );

    return { message: 'Rider leave updated successfully', leave: saved };
  }

  // ---------- HISTORY / ANALYTICS / REPORTS ----------

  async findRiderHistory(riderId: string, query: ListRiderHistoryQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.action) where.action = query.action;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      sortableFields: ['createdAt', 'action'],
      where,
    });
    const [items, total] = await this.historyRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRiderAnalytics(riderId: string, query: ListRiderAnalyticsQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.date) where.date = query.date;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'date'],
      where,
    });
    const [items, total] = await this.analyticsRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findRiderReports(riderId: string, query: ListRiderReportQueryDto) {
    await this.getRiderOrThrow(riderId);
    const where: Record<string, unknown> = { riderId };
    if (query.reportType) where.reportType = query.reportType;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'generatedAt', 'reportType'],
      where,
    });
    const [items, total] = await this.reportRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- PRIVATE HELPERS ----------

  private async getRiderOrThrow(id: string) {
    const rider = await this.riderRepository.findOne({ where: { id } });
    if (!rider) {
      throw new NotFoundException('Rider not found');
    }
    return rider;
  }

  private generateRiderCode(): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `RD-${randomNum}`;
  }
}
