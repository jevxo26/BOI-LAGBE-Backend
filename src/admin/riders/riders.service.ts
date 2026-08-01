import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Area } from '../areas/entities';
import { QueryBuilder } from '../common/utils/query-builder';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListRiderQueryDto } from './dto/list-rider-query.dto';
import { UpdateRiderStatusDto } from './dto/update-rider-status.dto';
import { AssignRiderAreasDto } from './dto/assign-rider-areas.dto';
import { Rider, RiderArea, RiderAreaStatus } from './entities';

@Injectable()
export class RidersService {
  constructor(
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @InjectRepository(RiderArea)
    private readonly riderAreaRepository: Repository<RiderArea>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

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
}
