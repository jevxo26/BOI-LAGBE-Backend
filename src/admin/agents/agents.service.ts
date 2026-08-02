import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '../../auth/entities';
import { Area, Institute } from '../areas/entities';
import { QueryBuilder } from '../common/utils/query-builder';
import { cleanDto } from '../common/utils/dto.util';
import { PaginatedQueryDto } from '../common/dto/paginated-query.dto';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UpdateAgentStatusDto } from './dto/update-agent-status.dto';
import { ListAgentQueryDto } from './dto/list-agent-query.dto';
import { AssignAgentAreasDto } from './dto/assign-agent-areas.dto';
import { AssignAgentInstitutesDto } from './dto/assign-agent-institutes.dto';
import { ListAgentPerformanceQueryDto } from './dto/list-agent-performance-query.dto';
import { ListAgentSalaryQueryDto } from './dto/list-agent-salary-query.dto';
import { ListAgentCommissionQueryDto } from './dto/list-agent-commission-query.dto';
import { ListAgentSettlementQueryDto } from './dto/list-agent-settlement-query.dto';
import { ListAgentWalletTransactionQueryDto } from './dto/list-agent-wallet-transaction-query.dto';
import { ListAgentDocumentQueryDto } from './dto/list-agent-document-query.dto';
import { VerifyAgentDocumentDto } from './dto/verify-agent-document.dto';
import { ListAgentLeaveQueryDto } from './dto/list-agent-leave-query.dto';
import { ApproveAgentLeaveDto } from './dto/approve-agent-leave.dto';
import { ListAgentAttendanceQueryDto } from './dto/list-agent-attendance-query.dto';
import { CreateAgentBonusDto } from './dto/create-agent-bonus.dto';
import { CreateAgentPenaltyDto } from './dto/create-agent-penalty.dto';
import { CreateAgentAnnouncementDto } from './dto/create-agent-announcement.dto';
import {
  Agent,
  AgentArea,
  AgentAreaStatus,
  AgentInstitute,
  AgentInstituteStatus,
  AgentPerformance,
  AgentSalary,
  AgentCommission,
  AgentSettlement,
  AgentWallet,
  AgentWalletTransaction,
  AgentDocument,
  DocumentVerificationStatus,
  AgentLeave,
  ApprovalStatus,
  AgentAttendance,
  AgentBonus,
  AgentPenalty,
  AgentAnnouncement,
} from './entities';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(AgentArea)
    private readonly agentAreaRepository: Repository<AgentArea>,
    @InjectRepository(AgentInstitute)
    private readonly agentInstituteRepository: Repository<AgentInstitute>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
    @InjectRepository(AgentPerformance)
    private readonly performanceRepository: Repository<AgentPerformance>,
    @InjectRepository(AgentSalary)
    private readonly salaryRepository: Repository<AgentSalary>,
    @InjectRepository(AgentCommission)
    private readonly commissionRepository: Repository<AgentCommission>,
    @InjectRepository(AgentSettlement)
    private readonly settlementRepository: Repository<AgentSettlement>,
    @InjectRepository(AgentWallet)
    private readonly walletRepository: Repository<AgentWallet>,
    @InjectRepository(AgentWalletTransaction)
    private readonly walletTransactionRepository: Repository<AgentWalletTransaction>,
    @InjectRepository(AgentDocument)
    private readonly documentRepository: Repository<AgentDocument>,
    @InjectRepository(AgentLeave)
    private readonly leaveRepository: Repository<AgentLeave>,
    @InjectRepository(AgentAttendance)
    private readonly attendanceRepository: Repository<AgentAttendance>,
    @InjectRepository(AgentBonus)
    private readonly bonusRepository: Repository<AgentBonus>,
    @InjectRepository(AgentPenalty)
    private readonly penaltyRepository: Repository<AgentPenalty>,
    @InjectRepository(AgentAnnouncement)
    private readonly announcementRepository: Repository<AgentAnnouncement>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  async findAllAgents(query: ListAgentQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.areaId) where.agentAreas = { areaId: query.areaId };
    if (query.instituteId)
      where.agentInstitutes = { instituteId: query.instituteId };

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['agentCode', 'fullName', 'phone', 'email'],
      sortableFields: ['createdAt', 'fullName', 'status'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.agentRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAgentById(id: string) {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: { agentAreas: true, agentInstitutes: true },
    });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    return agent;
  }

  async createAgent(dto: CreateAgentDto, req: AdminRequest) {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.agentRepository.findOne({
      where: { userId: dto.userId },
    });
    if (existing) {
      throw new BadRequestException('Agent already exists for this user');
    }

    const agent = this.agentRepository.create({
      ...cleanDto(dto),
      agentCode: this.generateAgentCode(),
      createdBy: req.user.id,
    });

    // Onboarding must be atomic: the agent row and the AGENT role grant on the
    // linked user are committed (or rolled back) together.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let saved: Agent;
    try {
      saved = await queryRunner.manager.save(agent);

      // Grant the AGENT role so the user can be authorized as an agent
      const roles = user.roles ?? [];
      if (!roles.includes('AGENT')) {
        roles.push('AGENT');
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
      'AGENTS',
      'CREATE',
      'Agent',
      saved.id,
      `Onboarded agent "${saved.fullName}"`,
      undefined,
      saved,
    );

    return { message: 'Agent onboarded successfully', agent: saved };
  }

  async updateAgent(id: string, dto: UpdateAgentDto, req: AdminRequest) {
    const agent = await this.agentRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const oldValue = { ...agent };
    Object.assign(agent, cleanDto(dto));
    const saved = await this.agentRepository.save(agent);

    await this.adminAuditService.log(
      req,
      'AGENTS',
      'UPDATE',
      'Agent',
      saved.id,
      `Updated agent "${saved.fullName}"`,
      oldValue,
      saved,
    );

    return { message: 'Agent updated successfully', agent: saved };
  }

  async updateAgentStatus(
    id: string,
    dto: UpdateAgentStatusDto,
    req: AdminRequest,
  ) {
    const agent = await this.agentRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const oldValue = { ...agent };
    agent.status = dto.status;
    const saved = await this.agentRepository.save(agent);

    await this.adminAuditService.log(
      req,
      'AGENTS',
      'UPDATE',
      'Agent',
      saved.id,
      `Updated agent status to ${saved.status}`,
      oldValue,
      saved,
    );

    return { message: 'Agent status updated successfully', agent: saved };
  }

  async assignAgentAreas(
    id: string,
    dto: AssignAgentAreasDto,
    req: AdminRequest,
  ) {
    const agent = await this.agentRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
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
      this.agentAreaRepository.create({
        agentId: id,
        areaId,
        isPrimary: areaId === primaryAreaId,
        assignedBy: req.user.id,
        assignedAt: new Date(),
        status: AgentAreaStatus.ACTIVE,
      }),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (dto.replaceExisting ?? true) {
        await queryRunner.manager.delete(AgentArea, { agentId: id });
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
      'AGENTS',
      'ASSIGN',
      'AgentArea',
      id,
      `Assigned ${rows.length} area(s) to agent "${agent.fullName}"`,
      undefined,
      { agentId: id, areaIds: dto.areaIds, primaryAreaId },
    );

    return {
      message: 'Agent areas assigned successfully',
      assigned: rows.length,
    };
  }

  async assignAgentInstitutes(
    id: string,
    dto: AssignAgentInstitutesDto,
    req: AdminRequest,
  ) {
    const agent = await this.agentRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const institutes = await this.instituteRepository.find({
      where: { id: In(dto.instituteIds) },
    });
    if (institutes.length !== dto.instituteIds.length) {
      throw new BadRequestException('One or more institute IDs are invalid');
    }

    const rows = dto.instituteIds.map((instituteId) =>
      this.agentInstituteRepository.create({
        agentId: id,
        instituteId,
        assignedBy: req.user.id,
        assignedAt: new Date(),
        status: AgentInstituteStatus.ACTIVE,
      }),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (dto.replaceExisting ?? true) {
        await queryRunner.manager.delete(AgentInstitute, { agentId: id });
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
      'AGENTS',
      'ASSIGN',
      'AgentInstitute',
      id,
      `Assigned ${rows.length} institute(s) to agent "${agent.fullName}"`,
      undefined,
      { agentId: id, instituteIds: dto.instituteIds },
    );

    return {
      message: 'Agent institutes assigned successfully',
      assigned: rows.length,
    };
  }

  // ---------- PERFORMANCE / SALARY / COMMISSION / SETTLEMENT ----------

  async findAgentPerformance(
    agentId: string,
    query: ListAgentPerformanceQueryDto,
  ) {
    await this.getAgentOrThrow(agentId);
    const where: Record<string, unknown> = { agentId };
    if (query.month) where.month = query.month;
    if (query.year) where.year = query.year;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'month', 'year'],
      where,
    });
    const [items, total] =
      await this.performanceRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAgentSalaries(agentId: string, query: ListAgentSalaryQueryDto) {
    await this.getAgentOrThrow(agentId);
    const where: Record<string, unknown> = { agentId };
    if (query.month) where.month = query.month;
    if (query.year) where.year = query.year;
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'month', 'year', 'netSalary'],
      where,
    });
    const [items, total] = await this.salaryRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAgentCommissions(
    agentId: string,
    query: ListAgentCommissionQueryDto,
  ) {
    await this.getAgentOrThrow(agentId);
    const where: Record<string, unknown> = { agentId };
    if (query.status) where.status = query.status;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'commissionAmount', 'status'],
      where,
    });
    const [items, total] =
      await this.commissionRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAgentSettlements(
    agentId: string,
    query: ListAgentSettlementQueryDto,
  ) {
    await this.getAgentOrThrow(agentId);
    const where: Record<string, unknown> = { agentId };
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

  async findAgentWallet(agentId: string) {
    await this.getAgentOrThrow(agentId);
    const wallet = await this.walletRepository.findOne({
      where: { agentId },
    });
    if (!wallet) {
      throw new NotFoundException('Agent wallet not found');
    }
    return wallet;
  }

  async findAgentWalletTransactions(
    agentId: string,
    query: ListAgentWalletTransactionQueryDto,
  ) {
    await this.getAgentOrThrow(agentId);
    const wallet = await this.walletRepository.findOne({ where: { agentId } });
    if (!wallet) {
      throw new NotFoundException('Agent wallet not found');
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

  // ---------- DOCUMENTS ----------

  async findAgentDocuments(agentId: string, query: ListAgentDocumentQueryDto) {
    await this.getAgentOrThrow(agentId);
    const where: Record<string, unknown> = { agentId };
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

  async verifyAgentDocument(
    documentId: string,
    dto: VerifyAgentDocumentDto,
    req: AdminRequest,
  ) {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException('Agent document not found');
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
      'AGENTS',
      'DOCUMENT_VERIFIED',
      'AgentDocument',
      saved.id,
      `Document verification set to ${saved.verificationStatus}`,
      oldValue,
      saved,
    );

    return { message: 'Agent document verified successfully', document: saved };
  }

  // ---------- LEAVE ----------

  async findAgentLeaves(agentId: string, query: ListAgentLeaveQueryDto) {
    await this.getAgentOrThrow(agentId);
    const where: Record<string, unknown> = { agentId };
    if (query.approvalStatus) where.approvalStatus = query.approvalStatus;
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'startDate', 'approvalStatus'],
      where,
    });
    const [items, total] = await this.leaveRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async approveAgentLeave(
    leaveId: string,
    dto: ApproveAgentLeaveDto,
    req: AdminRequest,
  ) {
    const leave = await this.leaveRepository.findOne({
      where: { id: leaveId },
    });
    if (!leave) {
      throw new NotFoundException('Agent leave not found');
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
      'AGENTS',
      'LEAVE_APPROVAL',
      'AgentLeave',
      saved.id,
      `Agent leave marked ${saved.approvalStatus}`,
      oldValue,
      saved,
    );

    return { message: 'Agent leave updated successfully', leave: saved };
  }

  // ---------- ATTENDANCE ----------

  async findAgentAttendance(
    agentId: string,
    query: ListAgentAttendanceQueryDto,
  ) {
    await this.getAgentOrThrow(agentId);
    const where: Record<string, unknown> = { agentId };
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

  // ---------- BONUS / PENALTY / ANNOUNCEMENT ----------

  async findAgentBonuses(agentId: string, query: PaginatedQueryDto) {
    await this.getAgentOrThrow(agentId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'amount'],
      where: { agentId },
    });
    const [items, total] = await this.bonusRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createAgentBonus(
    agentId: string,
    dto: CreateAgentBonusDto,
    req: AdminRequest,
  ) {
    const agent = await this.getAgentOrThrow(agentId);
    const bonus = this.bonusRepository.create({
      agentId,
      title: dto.title,
      amount: dto.amount,
      reason: dto.reason,
      approvedBy: req.user.id,
    });
    const saved = await this.bonusRepository.save(bonus);

    await this.adminAuditService.log(
      req,
      'AGENTS',
      'BONUS_GRANTED',
      'AgentBonus',
      saved.id,
      `Granted bonus ${saved.amount} to agent "${agent.fullName}"`,
      undefined,
      saved,
    );

    return { message: 'Agent bonus granted successfully', bonus: saved };
  }

  async findAgentPenalties(agentId: string, query: PaginatedQueryDto) {
    await this.getAgentOrThrow(agentId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'amount'],
      where: { agentId },
    });
    const [items, total] = await this.penaltyRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createAgentPenalty(
    agentId: string,
    dto: CreateAgentPenaltyDto,
    req: AdminRequest,
  ) {
    const agent = await this.getAgentOrThrow(agentId);
    const penalty = this.penaltyRepository.create({
      agentId,
      title: dto.title,
      amount: dto.amount,
      reason: dto.reason,
      approvedBy: req.user.id,
    });
    const saved = await this.penaltyRepository.save(penalty);

    await this.adminAuditService.log(
      req,
      'AGENTS',
      'PENALTY_APPLIED',
      'AgentPenalty',
      saved.id,
      `Applied penalty ${saved.amount} to agent "${agent.fullName}"`,
      undefined,
      saved,
    );

    return { message: 'Agent penalty applied successfully', penalty: saved };
  }

  async findAgentAnnouncements(agentId: string, query: PaginatedQueryDto) {
    await this.getAgentOrThrow(agentId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['createdAt', 'title'],
      where: { agentId },
    });
    const [items, total] =
      await this.announcementRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createAgentAnnouncement(
    agentId: string,
    dto: CreateAgentAnnouncementDto,
    req: AdminRequest,
  ) {
    const agent = await this.getAgentOrThrow(agentId);
    const announcement = this.announcementRepository.create({
      agentId,
      title: dto.title,
      message: dto.message,
      sentBy: req.user.id,
    });
    const saved = await this.announcementRepository.save(announcement);

    await this.adminAuditService.log(
      req,
      'AGENTS',
      'ANNOUNCEMENT_SENT',
      'AgentAnnouncement',
      saved.id,
      `Sent announcement "${saved.title}" to agent "${agent.fullName}"`,
      undefined,
      saved,
    );

    return {
      message: 'Agent announcement sent successfully',
      announcement: saved,
    };
  }

  // ---------- PRIVATE HELPERS ----------

  private async getAgentOrThrow(id: string) {
    const agent = await this.agentRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    return agent;
  }

  private generateAgentCode(): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `AG-${randomNum}`;
  }
}
