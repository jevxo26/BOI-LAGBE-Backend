import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryBuilder } from '../common/utils/query-builder';
import { cleanDto } from '../common/utils/dto.util';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ListAreaQueryDto } from './dto/list-area-query.dto';
import {
  Area,
  Country,
  CountryStatus,
  Division,
  DivisionStatus,
  District,
  DistrictStatus,
  Upazila,
  UpazilaStatus,
  Institute,
  InstituteCampus,
  InstituteCampusStatus,
  Department,
  DepartmentStatus,
  Program,
} from './entities';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(Upazila)
    private readonly upazilaRepository: Repository<Upazila>,
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
    @InjectRepository(InstituteCampus)
    private readonly instituteCampusRepository: Repository<InstituteCampus>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- AREAS ----------

  async findAllAreas(query: ListAreaQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    // Drill-down chain: only one geo level is applied at a time
    if (query.upazilaId) {
      where.upazilaId = query.upazilaId;
    } else if (query.districtId) {
      where.upazila = { districtId: query.districtId };
    } else if (query.divisionId) {
      where.upazila = { district: { divisionId: query.divisionId } };
    } else if (query.countryId) {
      where.upazila = {
        district: { division: { countryId: query.countryId } },
      };
    }

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['name', 'code', 'postalCode'],
      sortableFields: ['name', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.areaRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAreaById(id: string) {
    const area = await this.areaRepository.findOne({
      where: { id },
      relations: {
        upazila: { district: { division: { country: true } } },
      },
    });
    if (!area) {
      throw new NotFoundException('Area not found');
    }
    return area;
  }

  async createArea(dto: CreateAreaDto, req: AdminRequest) {
    const upazila = await this.upazilaRepository.findOne({
      where: { id: dto.upazilaId },
    });
    if (!upazila) {
      throw new BadRequestException('Invalid upazilaId: upazila not found');
    }

    const area = this.areaRepository.create(cleanDto(dto));
    const saved = await this.areaRepository.save(area);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'CREATE',
      'Area',
      saved.id,
      `Created area "${saved.name}"`,
      undefined,
      saved,
    );

    return { message: 'Area created successfully', area: saved };
  }

  async updateArea(id: string, dto: UpdateAreaDto, req: AdminRequest) {
    const area = await this.areaRepository.findOne({ where: { id } });
    if (!area) {
      throw new NotFoundException('Area not found');
    }

    if (dto.upazilaId && dto.upazilaId !== area.upazilaId) {
      const upazila = await this.upazilaRepository.findOne({
        where: { id: dto.upazilaId },
      });
      if (!upazila) {
        throw new BadRequestException('Invalid upazilaId: upazila not found');
      }
    }

    const oldValue = { ...area };
    Object.assign(area, cleanDto(dto));
    const saved = await this.areaRepository.save(area);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'UPDATE',
      'Area',
      saved.id,
      `Updated area "${saved.name}"`,
      oldValue,
      saved,
    );

    return { message: 'Area updated successfully', area: saved };
  }

  // ---------- GEO HIERARCHY (reference data) ----------

  async findCountries() {
    return this.countryRepository.find({
      where: { status: CountryStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findDivisions(countryId?: string) {
    return this.divisionRepository.find({
      where: {
        status: DivisionStatus.ACTIVE,
        ...(countryId ? { countryId } : {}),
      },
      order: { name: 'ASC' },
    });
  }

  async findDistricts(divisionId?: string) {
    return this.districtRepository.find({
      where: {
        status: DistrictStatus.ACTIVE,
        ...(divisionId ? { divisionId } : {}),
      },
      order: { name: 'ASC' },
    });
  }

  async findUpazilas(districtId?: string) {
    return this.upazilaRepository.find({
      where: {
        status: UpazilaStatus.ACTIVE,
        ...(districtId ? { districtId } : {}),
      },
      order: { name: 'ASC' },
    });
  }

  // ---------- INSTITUTES ----------

  async findAllInstitutes(query: ListAreaQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    // Drill-down chain: only one geo level is applied at a time
    if (query.upazilaId) {
      where.area = { upazilaId: query.upazilaId };
    } else if (query.districtId) {
      where.area = { upazila: { districtId: query.districtId } };
    } else if (query.divisionId) {
      where.area = { upazila: { district: { divisionId: query.divisionId } } };
    } else if (query.countryId) {
      where.area = {
        upazila: { district: { division: { countryId: query.countryId } } },
      };
    }

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['name', 'shortName', 'email', 'phone'],
      sortableFields: ['name', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.instituteRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findInstituteById(id: string) {
    const institute = await this.instituteRepository.findOne({
      where: { id },
      relations: { area: true },
    });
    if (!institute) {
      throw new NotFoundException('Institute not found');
    }

    const [campuses, departments, programs] = await Promise.all([
      this.instituteCampusRepository.find({
        where: { instituteId: id, status: InstituteCampusStatus.ACTIVE },
        order: { name: 'ASC' },
      }),
      this.departmentRepository.find({
        where: { instituteId: id, status: DepartmentStatus.ACTIVE },
        order: { name: 'ASC' },
      }),
      this.programRepository.find({
        where: { department: { instituteId: id } },
        order: { name: 'ASC' },
      }),
    ]);

    return { ...institute, campuses, departments, programs };
  }
}
