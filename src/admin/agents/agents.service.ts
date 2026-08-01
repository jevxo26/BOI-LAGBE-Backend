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
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UpdateAgentStatusDto } from './dto/update-agent-status.dto';
import { ListAgentQueryDto } from './dto/list-agent-query.dto';
import { AssignAgentAreasDto } from './dto/assign-agent-areas.dto';
import { AssignAgentInstitutesDto } from './dto/assign-agent-institutes.dto';
import {
  Agent,
  AgentArea,
  AgentAreaStatus,
  AgentInstitute,
  AgentInstituteStatus,
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

  private generateAgentCode(): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `AG-${randomNum}`;
  }
}
