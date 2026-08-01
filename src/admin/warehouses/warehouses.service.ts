import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from '../areas/entities';
import { QueryBuilder } from '../common/utils/query-builder';
import { cleanDto } from '../common/utils/dto.util';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { ListWarehouseQueryDto } from './dto/list-warehouse-query.dto';
import {
  Warehouse,
  WarehouseZone,
  WarehouseZoneStatus,
  WarehouseShelf,
  WarehouseShelfStatus,
  Supplier,
  SupplierStatus,
} from './entities';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(WarehouseZone)
    private readonly zoneRepository: Repository<WarehouseZone>,
    @InjectRepository(WarehouseShelf)
    private readonly shelfRepository: Repository<WarehouseShelf>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  async findAllWarehouses(query: ListWarehouseQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.warehouseType) where.warehouseType = query.warehouseType;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['warehouseCode', 'name', 'phone', 'email'],
      sortableFields: ['createdAt', 'name', 'status'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.warehouseRepository.findAndCount({
      ...options,
      relations: { area: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findWarehouseById(id: string) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
      relations: {
        area: true,
      },
    });
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    const [zones, shelves] = await Promise.all([
      this.zoneRepository.find({
        where: { warehouseId: id },
        order: { name: 'ASC' },
      }),
      this.shelfRepository.find({
        where: { warehouseId: id },
        order: { shelfCode: 'ASC' },
      }),
    ]);

    return { ...warehouse, zones, shelves };
  }

  async createWarehouse(dto: CreateWarehouseDto, req: AdminRequest) {
    if (dto.areaId) {
      const area = await this.areaRepository.findOne({
        where: { id: dto.areaId },
      });
      if (!area) {
        throw new BadRequestException('Invalid areaId: area not found');
      }
    }

    const warehouse = this.warehouseRepository.create(cleanDto(dto));
    const saved = await this.warehouseRepository.save(warehouse);

    await this.adminAuditService.log(
      req,
      'WAREHOUSES',
      'CREATE',
      'Warehouse',
      saved.id,
      `Created warehouse "${saved.name}"`,
      undefined,
      saved,
    );

    return { message: 'Warehouse created successfully', warehouse: saved };
  }

  async updateWarehouse(
    id: string,
    dto: UpdateWarehouseDto,
    req: AdminRequest,
  ) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    if (dto.areaId && dto.areaId !== warehouse.areaId) {
      const area = await this.areaRepository.findOne({
        where: { id: dto.areaId },
      });
      if (!area) {
        throw new BadRequestException('Invalid areaId: area not found');
      }
    }

    const oldValue = { ...warehouse };
    Object.assign(warehouse, cleanDto(dto));
    const saved = await this.warehouseRepository.save(warehouse);

    await this.adminAuditService.log(
      req,
      'WAREHOUSES',
      'UPDATE',
      'Warehouse',
      saved.id,
      `Updated warehouse "${saved.name}"`,
      oldValue,
      saved,
    );

    return { message: 'Warehouse updated successfully', warehouse: saved };
  }

  // ---------- REFERENCE DATA (zones / shelves / suppliers) ----------

  async findZones(warehouseId?: string) {
    return this.zoneRepository.find({
      where: {
        status: WarehouseZoneStatus.ACTIVE,
        ...(warehouseId ? { warehouseId } : {}),
      },
      order: { name: 'ASC' },
    });
  }

  async findShelves(warehouseId?: string, zoneId?: string) {
    return this.shelfRepository.find({
      where: {
        status: WarehouseShelfStatus.ACTIVE,
        ...(warehouseId ? { warehouseId } : {}),
        ...(zoneId ? { zoneId } : {}),
      },
      relations: { zone: true },
      order: { shelfCode: 'ASC' },
    });
  }

  async findSuppliers() {
    return this.supplierRepository.find({
      where: { status: SupplierStatus.ACTIVE },
      order: { companyName: 'ASC' },
    });
  }
}
