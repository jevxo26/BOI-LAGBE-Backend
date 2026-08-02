import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
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

// All area routes require authentication (global StrictJwtAuthGuard) AND the
// ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before the parameterized :id route.
@ApiTags('Admin - Areas')
@ApiBearerAuth()
@Controller('admin/areas')
@AdminOnly()
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  // ---------- GEO HIERARCHY (reference data) ----------

  @Get('countries')
  async findCountries() {
    return this.areasService.findCountries();
  }

  @Get('divisions')
  async findDivisions(@Query('countryId') countryId?: string) {
    return this.areasService.findDivisions(countryId);
  }

  @Get('districts')
  async findDistricts(@Query('divisionId') divisionId?: string) {
    return this.areasService.findDistricts(divisionId);
  }

  @Get('upazilas')
  async findUpazilas(@Query('districtId') districtId?: string) {
    return this.areasService.findUpazilas(districtId);
  }

  // ---------- AREA COVERAGE ----------

  @Get('coverage')
  async findCoverage(@Query() query: ListAreaCoverageQueryDto) {
    return this.areasService.findAreaCoverage(query);
  }

  @Post('coverage')
  async createCoverage(
    @Body() dto: CreateAreaCoverageDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.createAreaCoverage(dto, req);
  }

  @Patch('coverage/:id')
  async updateCoverage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAreaCoverageDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.updateAreaCoverage(id, dto, req);
  }

  // ---------- ACADEMIC SESSIONS (static routes first) ----------

  @Get('academic-sessions')
  async findAcademicSessions(@Query() query: PaginatedQueryDto) {
    return this.areasService.findAcademicSessions(query);
  }

  @Post('academic-sessions')
  async createAcademicSession(
    @Body() dto: CreateAcademicSessionDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.createAcademicSession(dto, req);
  }

  @Patch('academic-sessions/:id')
  async updateAcademicSession(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAcademicSessionDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.updateAcademicSession(id, dto, req);
  }

  // ---------- STUDENT INSTITUTES ----------

  @Get('student-institutes')
  async findStudentInstitutes(@Query() query: ListStudentInstituteQueryDto) {
    return this.areasService.findStudentInstitutes(query);
  }

  @Post('student-institutes')
  async createStudentInstitute(
    @Body() dto: CreateStudentInstituteDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.createStudentInstitute(dto, req);
  }

  @Patch('student-institutes/:id')
  async updateStudentInstitute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentInstituteDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.updateStudentInstitute(id, dto, req);
  }

  // ---------- INSTITUTES ----------

  @Get('institutes')
  async findAllInstitutes(@Query() query: ListAreaQueryDto) {
    return this.areasService.findAllInstitutes(query);
  }

  @Post('institutes')
  async createInstitute(
    @Body() dto: CreateInstituteDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.createInstitute(dto, req);
  }

  @Get('institutes/:id')
  async findInstituteById(@Param('id', ParseUUIDPipe) id: string) {
    return this.areasService.findInstituteById(id);
  }

  @Patch('institutes/:id')
  async updateInstitute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInstituteDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.updateInstitute(id, dto, req);
  }

  // ---------- CAMPUS (nested under institute) ----------

  @Get('institutes/:id/campuses')
  async findCampuses(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.areasService.findInstituteCampuses(id, query);
  }

  @Post('institutes/:id/campuses')
  async createCampus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateInstituteCampusDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.createInstituteCampus(id, dto, req);
  }

  @Patch('campuses/:campusId')
  async updateCampus(
    @Param('campusId', ParseUUIDPipe) campusId: string,
    @Body() dto: UpdateInstituteCampusDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.updateInstituteCampus(campusId, dto, req);
  }

  // ---------- DEPARTMENT (nested under institute) ----------

  @Get('institutes/:id/departments')
  async findDepartments(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.areasService.findDepartments(id, query);
  }

  @Post('departments')
  async createDepartment(
    @Body() dto: CreateDepartmentDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.createDepartment(dto, req);
  }

  @Patch('departments/:id')
  async updateDepartment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDepartmentDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.updateDepartment(id, dto, req);
  }

  // ---------- PROGRAM (nested under department) ----------

  @Get('departments/:id/programs')
  async findPrograms(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.areasService.findPrograms(id, query);
  }

  @Post('programs')
  async createProgram(@Body() dto: CreateProgramDto, @Req() req: AdminRequest) {
    return this.areasService.createProgram(dto, req);
  }

  @Patch('programs/:id')
  async updateProgram(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProgramDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.updateProgram(id, dto, req);
  }

  // ---------- SEMESTER (nested under program) ----------

  @Get('programs/:id/semesters')
  async findSemesters(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.areasService.findSemesters(id, query);
  }

  @Post('semesters')
  async createSemester(
    @Body() dto: CreateSemesterDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.createSemester(dto, req);
  }

  @Patch('semesters/:id')
  async updateSemester(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSemesterDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.updateSemester(id, dto, req);
  }

  // ---------- INSTITUTE AGENTS / DOCUMENTS ----------

  @Get('institutes/:id/agents')
  async findInstituteAgents(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.areasService.findInstituteAgents(id, query);
  }

  @Post('institutes/:id/agents')
  async assignInstituteAgent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignInstituteAgentDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.assignInstituteAgent(id, dto, req);
  }

  @Get('institutes/:id/documents')
  async findInstituteDocuments(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.areasService.findInstituteDocuments(id, query);
  }

  @Post('institutes/:id/documents')
  async createInstituteDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateInstituteDocumentDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.createInstituteDocument(id, dto, req);
  }

  // ---------- AREAS ----------

  @Get()
  async findAllAreas(@Query() query: ListAreaQueryDto) {
    return this.areasService.findAllAreas(query);
  }

  @Get(':id')
  async findAreaById(@Param('id', ParseUUIDPipe) id: string) {
    return this.areasService.findAreaById(id);
  }

  @Post()
  async createArea(@Body() dto: CreateAreaDto, @Req() req: AdminRequest) {
    return this.areasService.createArea(dto, req);
  }

  @Patch(':id')
  async updateArea(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAreaDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.updateArea(id, dto, req);
  }
}
