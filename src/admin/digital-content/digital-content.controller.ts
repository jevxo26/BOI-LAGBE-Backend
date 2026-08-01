import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { DigitalContentService } from './digital-content.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateDigitalContentDto } from './dto/create-digital-content.dto';
import { UpdateDigitalContentDto } from './dto/update-digital-content.dto';
import { ListDigitalContentQueryDto } from './dto/list-digital-content-query.dto';
import { PublishDigitalContentDto } from './dto/publish-digital-content.dto';
import { GrantDigitalAccessDto } from './dto/grant-digital-access.dto';
import { ListDigitalReviewQueryDto } from './dto/list-digital-review-query.dto';
import { ModerateDigitalReviewDto } from './dto/moderate-digital-review.dto';
import { CreateDigitalExamDto } from './dto/create-digital-exam.dto';
import { ListDigitalExamQueryDto } from './dto/list-digital-exam-query.dto';
import { IssueDigitalCertificateDto } from './dto/issue-digital-certificate.dto';
import { ListDigitalCertificateQueryDto } from './dto/list-digital-certificate-query.dto';
import { ListDigitalAnalyticsQueryDto } from './dto/list-digital-analytics-query.dto';
import { ListDigitalReportQueryDto } from './dto/list-digital-report-query.dto';

// All digital-content routes require authentication (global StrictJwtAuthGuard)
// AND the ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before any parameterized :id route.
@Controller('admin/digital-content')
@AdminOnly()
export class DigitalContentController {
  constructor(private readonly digitalContentService: DigitalContentService) {}

  // ---------- REFERENCE DATA (static routes first) ----------

  @Get('categories')
  async findCategories() {
    return this.digitalContentService.findCategories();
  }

  @Get('subcategories')
  async findSubCategories(@Query('categoryId') categoryId?: string) {
    return this.digitalContentService.findSubCategories(categoryId);
  }

  @Get('authors')
  async findAuthors() {
    return this.digitalContentService.findAuthors();
  }

  @Get('publishers')
  async findPublishers() {
    return this.digitalContentService.findPublishers();
  }

  @Get('courses')
  async findCourses() {
    return this.digitalContentService.findCourses();
  }

  @Get('departments')
  async findDepartments() {
    return this.digitalContentService.findDepartments();
  }

  @Get('semesters')
  async findSemesters() {
    return this.digitalContentService.findSemesters();
  }

  @Get('institutes')
  async findInstitutes() {
    return this.digitalContentService.findInstitutes();
  }

  // ---------- REVIEW MODERATION ----------

  @Get('reviews')
  async findAllReviews(@Query() query: ListDigitalReviewQueryDto) {
    return this.digitalContentService.findAllReviews(query);
  }

  @Patch('reviews/:id/moderate')
  async moderateReview(
    @Param('id') id: string,
    @Body() dto: ModerateDigitalReviewDto,
    @Req() req: AdminRequest,
  ) {
    return this.digitalContentService.moderateReview(id, dto, req);
  }

  // ---------- EXAMS + CERTIFICATES ----------

  @Get('exams')
  async findAllExams(@Query() query: ListDigitalExamQueryDto) {
    return this.digitalContentService.findAllExams(query);
  }

  @Post('exams')
  async createExam(
    @Body() dto: CreateDigitalExamDto,
    @Req() req: AdminRequest,
  ) {
    return this.digitalContentService.createExam(dto, req);
  }

  @Post('exams/:id/publish')
  async publishExam(
    @Param('id') id: string,
    @Body() dto: PublishDigitalContentDto,
    @Req() req: AdminRequest,
  ) {
    return this.digitalContentService.publishExam(id, dto, req);
  }

  @Get('certificates')
  async findAllCertificates(@Query() query: ListDigitalCertificateQueryDto) {
    return this.digitalContentService.findAllCertificates(query);
  }

  @Post('certificates')
  async issueCertificate(
    @Body() dto: IssueDigitalCertificateDto,
    @Req() req: AdminRequest,
  ) {
    return this.digitalContentService.issueCertificate(dto, req);
  }

  // ---------- ANALYTICS + REPORTS ----------

  @Get('analytics')
  async findAllAnalytics(@Query() query: ListDigitalAnalyticsQueryDto) {
    return this.digitalContentService.findAllAnalytics(query);
  }

  @Get('reports')
  async findAllReports(@Query() query: ListDigitalReportQueryDto) {
    return this.digitalContentService.findAllReports(query);
  }

  // ---------- CONTENT ----------

  @Get()
  async findAll(@Query() query: ListDigitalContentQueryDto) {
    return this.digitalContentService.findAllContent(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.digitalContentService.findContentById(id);
  }

  @Post()
  async create(@Body() dto: CreateDigitalContentDto, @Req() req: AdminRequest) {
    return this.digitalContentService.createContent(dto, req);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDigitalContentDto,
    @Req() req: AdminRequest,
  ) {
    return this.digitalContentService.updateContent(id, dto, req);
  }

  @Post(':id/publish')
  async publish(
    @Param('id') id: string,
    @Body() dto: PublishDigitalContentDto,
    @Req() req: AdminRequest,
  ) {
    return this.digitalContentService.publishContent(id, dto, req);
  }

  @Post(':id/access-grant')
  async grantAccess(
    @Param('id') id: string,
    @Body() dto: GrantDigitalAccessDto,
    @Req() req: AdminRequest,
  ) {
    return this.digitalContentService.grantAccess(id, dto, req);
  }
}
