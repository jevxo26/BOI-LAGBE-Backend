import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities';
import { QueryBuilder } from '../common/utils/query-builder';
import { cleanDto } from '../common/utils/dto.util';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { PaginatedQueryDto } from '../common/dto/paginated-query.dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ListAreaQueryDto } from './dto/list-area-query.dto';
import { CreateAreaCoverageDto } from './dto/create-area-coverage.dto';
import { UpdateAreaCoverageDto } from './dto/update-area-coverage.dto';
import { ListAreaCoverageQueryDto } from './dto/list-area-coverage-query.dto';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { CreateInstituteCampusDto } from './dto/create-institute-campus.dto';
import { UpdateInstituteCampusDto } from './dto/update-institute-campus.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { CreateAcademicSessionDto } from './dto/create-academic-session.dto';
import { UpdateAcademicSessionDto } from './dto/update-academic-session.dto';
import { CreateStudentInstituteDto } from './dto/create-student-institute.dto';
import { UpdateStudentInstituteDto } from './dto/update-student-institute.dto';
import { ListStudentInstituteQueryDto } from './dto/list-student-institute-query.dto';
import { AssignInstituteAgentDto } from './dto/assign-institute-agent.dto';
import { CreateInstituteDocumentDto } from './dto/create-institute-document.dto';
import {
  Area,
  AreaCoverage,
  AreaCoverageStatus,
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
  ProgramStatus,
  Semester,
  SemesterStatus,
  AcademicSession,
  AcademicSessionStatus,
  StudentInstitute,
  StudentStatus,
  InstituteAgent,
  InstituteAgentStatus,
  InstituteDocument,
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
    @InjectRepository(AreaCoverage)
    private readonly areaCoverageRepository: Repository<AreaCoverage>,
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
    @InjectRepository(InstituteCampus)
    private readonly instituteCampusRepository: Repository<InstituteCampus>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
    @InjectRepository(AcademicSession)
    private readonly academicSessionRepository: Repository<AcademicSession>,
    @InjectRepository(StudentInstitute)
    private readonly studentInstituteRepository: Repository<StudentInstitute>,
    @InjectRepository(InstituteAgent)
    private readonly instituteAgentRepository: Repository<InstituteAgent>,
    @InjectRepository(InstituteDocument)
    private readonly instituteDocumentRepository: Repository<InstituteDocument>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  // ---------- AREA COVERAGE ----------

  async findAreaCoverage(query: ListAreaCoverageQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.areaId) where.areaId = query.areaId;
    if (query.agentId) where.agentId = query.agentId;
    if (query.status) where.status = query.status;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['priority', 'deliveryCharge', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] =
      await this.areaCoverageRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createAreaCoverage(dto: CreateAreaCoverageDto, req: AdminRequest) {
    const area = await this.areaRepository.findOne({
      where: { id: dto.areaId },
    });
    if (!area) {
      throw new BadRequestException('Invalid areaId: area not found');
    }

    const existing = await this.areaCoverageRepository.findOne({
      where: { areaId: dto.areaId, agentId: dto.agentId },
    });
    if (existing) {
      throw new BadRequestException(
        'Area coverage already exists for this agent and area',
      );
    }

    const coverage = this.areaCoverageRepository.create({
      ...cleanDto(dto),
      status: AreaCoverageStatus.ACTIVE,
    });
    const saved = await this.areaCoverageRepository.save(coverage);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'CREATE',
      'AreaCoverage',
      saved.id,
      `Assigned agent ${saved.agentId} coverage for area "${area.name}"`,
      undefined,
      saved,
    );

    return { message: 'Area coverage created successfully', coverage: saved };
  }

  async updateAreaCoverage(
    id: string,
    dto: UpdateAreaCoverageDto,
    req: AdminRequest,
  ) {
    const coverage = await this.areaCoverageRepository.findOne({
      where: { id },
    });
    if (!coverage) {
      throw new NotFoundException('Area coverage not found');
    }

    const oldValue = { ...coverage };
    Object.assign(coverage, cleanDto(dto));
    const saved = await this.areaCoverageRepository.save(coverage);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'UPDATE',
      'AreaCoverage',
      saved.id,
      'Updated area coverage',
      oldValue,
      saved,
    );

    return { message: 'Area coverage updated successfully', coverage: saved };
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

    const [campuses, departments, programs, agents, documents] =
      await Promise.all([
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
        this.instituteAgentRepository.find({
          where: { instituteId: id, status: InstituteAgentStatus.ACTIVE },
          order: { createdAt: 'ASC' },
        }),
        this.instituteDocumentRepository.find({
          where: { instituteId: id },
          order: { createdAt: 'DESC' },
        }),
      ]);

    return { ...institute, campuses, departments, programs, agents, documents };
  }

  async createInstitute(dto: CreateInstituteDto, req: AdminRequest) {
    const area = await this.areaRepository.findOne({
      where: { id: dto.areaId },
    });
    if (!area) {
      throw new BadRequestException('Invalid areaId: area not found');
    }

    const institute = this.instituteRepository.create(cleanDto(dto));
    const saved = await this.instituteRepository.save(institute);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'CREATE',
      'Institute',
      saved.id,
      `Created institute "${saved.name}"`,
      undefined,
      saved,
    );

    return { message: 'Institute created successfully', institute: saved };
  }

  async updateInstitute(
    id: string,
    dto: UpdateInstituteDto,
    req: AdminRequest,
  ) {
    const institute = await this.instituteRepository.findOne({ where: { id } });
    if (!institute) {
      throw new NotFoundException('Institute not found');
    }

    if (dto.areaId && dto.areaId !== institute.areaId) {
      const area = await this.areaRepository.findOne({
        where: { id: dto.areaId },
      });
      if (!area) {
        throw new BadRequestException('Invalid areaId: area not found');
      }
    }

    const oldValue = { ...institute };
    Object.assign(institute, cleanDto(dto));
    const saved = await this.instituteRepository.save(institute);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'UPDATE',
      'Institute',
      saved.id,
      `Updated institute "${saved.name}"`,
      oldValue,
      saved,
    );

    return { message: 'Institute updated successfully', institute: saved };
  }

  // ---------- CAMPUS ----------

  async findInstituteCampuses(instituteId: string, query: PaginatedQueryDto) {
    await this.getInstituteOrThrow(instituteId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['name', 'createdAt'],
      where: { instituteId },
    });
    const [items, total] =
      await this.instituteCampusRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createInstituteCampus(
    instituteId: string,
    dto: CreateInstituteCampusDto,
    req: AdminRequest,
  ) {
    const institute = await this.getInstituteOrThrow(instituteId);
    const campus = this.instituteCampusRepository.create({
      ...cleanDto(dto),
      instituteId,
      status: InstituteCampusStatus.ACTIVE,
    });
    const saved = await this.instituteCampusRepository.save(campus);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'CREATE',
      'InstituteCampus',
      saved.id,
      `Created campus "${saved.name}" for "${institute.name}"`,
      undefined,
      saved,
    );

    return { message: 'Campus created successfully', campus: saved };
  }

  async updateInstituteCampus(
    id: string,
    dto: UpdateInstituteCampusDto,
    req: AdminRequest,
  ) {
    const campus = await this.instituteCampusRepository.findOne({
      where: { id },
    });
    if (!campus) {
      throw new NotFoundException('Campus not found');
    }

    const oldValue = { ...campus };
    Object.assign(campus, cleanDto(dto));
    const saved = await this.instituteCampusRepository.save(campus);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'UPDATE',
      'InstituteCampus',
      saved.id,
      `Updated campus "${saved.name}"`,
      oldValue,
      saved,
    );

    return { message: 'Campus updated successfully', campus: saved };
  }

  // ---------- DEPARTMENT ----------

  async findDepartments(instituteId: string, query: PaginatedQueryDto) {
    await this.getInstituteOrThrow(instituteId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['name', 'createdAt'],
      where: { instituteId },
    });
    const [items, total] =
      await this.departmentRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createDepartment(dto: CreateDepartmentDto, req: AdminRequest) {
    const institute = await this.getInstituteOrThrow(dto.instituteId);
    const department = this.departmentRepository.create({
      ...cleanDto(dto),
      status: DepartmentStatus.ACTIVE,
    });
    const saved = await this.departmentRepository.save(department);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'CREATE',
      'Department',
      saved.id,
      `Created department "${saved.name}" for "${institute.name}"`,
      undefined,
      saved,
    );

    return { message: 'Department created successfully', department: saved };
  }

  async updateDepartment(
    id: string,
    dto: UpdateDepartmentDto,
    req: AdminRequest,
  ) {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const oldValue = { ...department };
    Object.assign(department, cleanDto(dto));
    const saved = await this.departmentRepository.save(department);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'UPDATE',
      'Department',
      saved.id,
      `Updated department "${saved.name}"`,
      oldValue,
      saved,
    );

    return { message: 'Department updated successfully', department: saved };
  }

  // ---------- PROGRAM ----------

  async findPrograms(departmentId: string, query: PaginatedQueryDto) {
    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
    });
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['name', 'createdAt'],
      where: { departmentId },
    });
    const [items, total] = await this.programRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createProgram(dto: CreateProgramDto, req: AdminRequest) {
    const department = await this.departmentRepository.findOne({
      where: { id: dto.departmentId },
    });
    if (!department) {
      throw new BadRequestException(
        'Invalid departmentId: department not found',
      );
    }

    const program = this.programRepository.create({
      ...cleanDto(dto),
      status: ProgramStatus.ACTIVE,
    });
    const saved = await this.programRepository.save(program);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'CREATE',
      'Program',
      saved.id,
      `Created program "${saved.name}" under "${department.name}"`,
      undefined,
      saved,
    );

    return { message: 'Program created successfully', program: saved };
  }

  async updateProgram(id: string, dto: UpdateProgramDto, req: AdminRequest) {
    const program = await this.programRepository.findOne({ where: { id } });
    if (!program) {
      throw new NotFoundException('Program not found');
    }

    const oldValue = { ...program };
    Object.assign(program, cleanDto(dto));
    const saved = await this.programRepository.save(program);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'UPDATE',
      'Program',
      saved.id,
      `Updated program "${saved.name}"`,
      oldValue,
      saved,
    );

    return { message: 'Program updated successfully', program: saved };
  }

  // ---------- SEMESTER ----------

  async findSemesters(programId: string, query: PaginatedQueryDto) {
    const program = await this.programRepository.findOne({
      where: { id: programId },
    });
    if (!program) {
      throw new NotFoundException('Program not found');
    }
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['name', 'semesterNumber', 'createdAt'],
      where: { programId },
    });
    const [items, total] = await this.semesterRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createSemester(dto: CreateSemesterDto, req: AdminRequest) {
    const program = await this.programRepository.findOne({
      where: { id: dto.programId },
    });
    if (!program) {
      throw new BadRequestException('Invalid programId: program not found');
    }

    const semester = this.semesterRepository.create({
      ...cleanDto(dto),
      status: SemesterStatus.ACTIVE,
    });
    const saved = await this.semesterRepository.save(semester);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'CREATE',
      'Semester',
      saved.id,
      `Created semester "${saved.name}" for program "${program.name}"`,
      undefined,
      saved,
    );

    return { message: 'Semester created successfully', semester: saved };
  }

  async updateSemester(id: string, dto: UpdateSemesterDto, req: AdminRequest) {
    const semester = await this.semesterRepository.findOne({ where: { id } });
    if (!semester) {
      throw new NotFoundException('Semester not found');
    }

    const oldValue = { ...semester };
    Object.assign(semester, cleanDto(dto));
    const saved = await this.semesterRepository.save(semester);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'UPDATE',
      'Semester',
      saved.id,
      `Updated semester "${saved.name}"`,
      oldValue,
      saved,
    );

    return { message: 'Semester updated successfully', semester: saved };
  }

  // ---------- ACADEMIC SESSION ----------

  async findAcademicSessions(query: PaginatedQueryDto) {
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['name', 'startDate', 'createdAt'],
    });
    const [items, total] =
      await this.academicSessionRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createAcademicSession(
    dto: CreateAcademicSessionDto,
    req: AdminRequest,
  ) {
    const session = this.academicSessionRepository.create({
      ...cleanDto(dto),
      status: AcademicSessionStatus.ACTIVE,
    });
    const saved = await this.academicSessionRepository.save(session);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'CREATE',
      'AcademicSession',
      saved.id,
      `Created academic session "${saved.name}"`,
      undefined,
      saved,
    );

    return { message: 'Academic session created successfully', session: saved };
  }

  async updateAcademicSession(
    id: string,
    dto: UpdateAcademicSessionDto,
    req: AdminRequest,
  ) {
    const session = await this.academicSessionRepository.findOne({
      where: { id },
    });
    if (!session) {
      throw new NotFoundException('Academic session not found');
    }

    const oldValue = { ...session };
    Object.assign(session, cleanDto(dto));
    const saved = await this.academicSessionRepository.save(session);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'UPDATE',
      'AcademicSession',
      saved.id,
      `Updated academic session "${saved.name}"`,
      oldValue,
      saved,
    );

    return { message: 'Academic session updated successfully', session: saved };
  }

  // ---------- STUDENT INSTITUTE ----------

  async findStudentInstitutes(query: ListStudentInstituteQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.instituteId) where.instituteId = query.instituteId;
    if (query.programId) where.programId = query.programId;
    if (query.studentStatus) where.studentStatus = query.studentStatus;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      sortableFields: ['createdAt', 'studentStatus'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] =
      await this.studentInstituteRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createStudentInstitute(
    dto: CreateStudentInstituteDto,
    req: AdminRequest,
  ) {
    const student = await this.userRepository.findOne({
      where: { id: dto.studentId },
    });
    if (!student) {
      throw new BadRequestException('Invalid studentId: user not found');
    }
    await this.getInstituteOrThrow(dto.instituteId);

    const record = this.studentInstituteRepository.create({
      ...cleanDto(dto),
      studentStatus: dto.studentStatus ?? StudentStatus.ACTIVE,
    });
    const saved = await this.studentInstituteRepository.save(record);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'CREATE',
      'StudentInstitute',
      saved.id,
      `Enrolled student ${saved.studentId} at institute ${saved.instituteId}`,
      undefined,
      saved,
    );

    return { message: 'Student enrolled successfully', record: saved };
  }

  async updateStudentInstitute(
    id: string,
    dto: UpdateStudentInstituteDto,
    req: AdminRequest,
  ) {
    const record = await this.studentInstituteRepository.findOne({
      where: { id },
    });
    if (!record) {
      throw new NotFoundException('Student-institute record not found');
    }

    const oldValue = { ...record };
    Object.assign(record, cleanDto(dto));
    const saved = await this.studentInstituteRepository.save(record);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'UPDATE',
      'StudentInstitute',
      saved.id,
      `Updated student-institute record (student ${saved.studentId})`,
      oldValue,
      saved,
    );

    return {
      message: 'Student-institute record updated successfully',
      record: saved,
    };
  }

  // ---------- INSTITUTE AGENT ----------

  async findInstituteAgents(instituteId: string, query: PaginatedQueryDto) {
    await this.getInstituteOrThrow(instituteId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['assignedAt', 'createdAt'],
      where: { instituteId },
    });
    const [items, total] =
      await this.instituteAgentRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async assignInstituteAgent(
    instituteId: string,
    dto: AssignInstituteAgentDto,
    req: AdminRequest,
  ) {
    const institute = await this.getInstituteOrThrow(instituteId);

    const existing = await this.instituteAgentRepository.findOne({
      where: { instituteId, agentId: dto.agentId },
    });
    if (existing) {
      throw new BadRequestException(
        'Agent is already assigned to this institute',
      );
    }

    const row = this.instituteAgentRepository.create({
      instituteId,
      agentId: dto.agentId,
      assignedBy: req.user.id,
      assignedAt: new Date(),
      status: InstituteAgentStatus.ACTIVE,
    });
    const saved = await this.instituteAgentRepository.save(row);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'ASSIGN',
      'InstituteAgent',
      saved.id,
      `Assigned agent ${saved.agentId} to institute "${institute.name}"`,
      undefined,
      saved,
    );

    return {
      message: 'Agent assigned to institute successfully',
      record: saved,
    };
  }

  // ---------- INSTITUTE DOCUMENT ----------

  async findInstituteDocuments(instituteId: string, query: PaginatedQueryDto) {
    await this.getInstituteOrThrow(instituteId);
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      sortableFields: ['documentName', 'createdAt'],
      where: { instituteId },
    });
    const [items, total] =
      await this.instituteDocumentRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createInstituteDocument(
    instituteId: string,
    dto: CreateInstituteDocumentDto,
    req: AdminRequest,
  ) {
    const institute = await this.getInstituteOrThrow(instituteId);
    const document = this.instituteDocumentRepository.create({
      ...cleanDto(dto),
      instituteId,
      uploadedBy: req.user.id,
    });
    const saved = await this.instituteDocumentRepository.save(document);

    await this.adminAuditService.log(
      req,
      'AREAS',
      'CREATE',
      'InstituteDocument',
      saved.id,
      `Uploaded document "${saved.documentName}" for "${institute.name}"`,
      undefined,
      saved,
    );

    return {
      message: 'Institute document uploaded successfully',
      document: saved,
    };
  }

  // ---------- PRIVATE HELPERS ----------

  private async getInstituteOrThrow(id: string) {
    const institute = await this.instituteRepository.findOne({ where: { id } });
    if (!institute) {
      throw new NotFoundException('Institute not found');
    }
    return institute;
  }
}
