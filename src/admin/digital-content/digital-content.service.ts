import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryBuilder } from '../common/utils/query-builder';
import { cleanDto, slugify } from '../common/utils/dto.util';
import { AdminAuditService } from '../common/services/admin-audit.service';
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
import { ListDigitalAnalyticsQueryDto } from './dto/list-digital-analytics-query.dto';
import { ListDigitalReportQueryDto } from './dto/list-digital-report-query.dto';
import { ListDigitalCertificateQueryDto } from './dto/list-digital-certificate-query.dto';
import {
  DigitalContent,
  DigitalContentStatus,
  DigitalCategory,
  DigitalCategoryStatus,
  DigitalSubCategory,
  DigitalSubCategoryStatus,
  DigitalAuthor,
  DigitalAuthorStatus,
  DigitalPublisher,
  DigitalPublisherStatus,
  DigitalCourse,
  DigitalCourseStatus,
  DigitalDepartment,
  DigitalDepartmentStatus,
  DigitalSemester,
  DigitalSemesterStatus,
  DigitalInstitute,
  DigitalInstituteStatus,
  DigitalAccess,
  DigitalAccessStatus,
  DigitalDownload,
  DigitalRating,
  DigitalReview,
  DigitalExam,
  DigitalExamStatus,
  DigitalCertificate,
  DigitalCertificateStatus,
  DigitalAnalytics,
  DigitalReport,
} from './entities';

@Injectable()
export class DigitalContentService {
  constructor(
    @InjectRepository(DigitalContent)
    private readonly contentRepository: Repository<DigitalContent>,
    @InjectRepository(DigitalCategory)
    private readonly categoryRepository: Repository<DigitalCategory>,
    @InjectRepository(DigitalSubCategory)
    private readonly subCategoryRepository: Repository<DigitalSubCategory>,
    @InjectRepository(DigitalAuthor)
    private readonly authorRepository: Repository<DigitalAuthor>,
    @InjectRepository(DigitalPublisher)
    private readonly publisherRepository: Repository<DigitalPublisher>,
    @InjectRepository(DigitalCourse)
    private readonly courseRepository: Repository<DigitalCourse>,
    @InjectRepository(DigitalDepartment)
    private readonly departmentRepository: Repository<DigitalDepartment>,
    @InjectRepository(DigitalSemester)
    private readonly semesterRepository: Repository<DigitalSemester>,
    @InjectRepository(DigitalInstitute)
    private readonly instituteRepository: Repository<DigitalInstitute>,
    @InjectRepository(DigitalAccess)
    private readonly accessRepository: Repository<DigitalAccess>,
    @InjectRepository(DigitalDownload)
    private readonly downloadRepository: Repository<DigitalDownload>,
    @InjectRepository(DigitalRating)
    private readonly ratingRepository: Repository<DigitalRating>,
    @InjectRepository(DigitalReview)
    private readonly reviewRepository: Repository<DigitalReview>,
    @InjectRepository(DigitalExam)
    private readonly examRepository: Repository<DigitalExam>,
    @InjectRepository(DigitalCertificate)
    private readonly certificateRepository: Repository<DigitalCertificate>,
    @InjectRepository(DigitalAnalytics)
    private readonly analyticsRepository: Repository<DigitalAnalytics>,
    @InjectRepository(DigitalReport)
    private readonly reportRepository: Repository<DigitalReport>,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- CONTENT CRUD ----------

  async findAllContent(query: ListDigitalContentQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.authorId) where.authorId = query.authorId;
    if (query.publisherId) where.publisherId = query.publisherId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['title', 'contentCode', 'slug'],
      sortableFields: ['title', 'contentCode', 'price', 'createdAt', 'status'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.contentRepository.findAndCount({
      ...options,
      relations: {
        category: true,
        subcategory: true,
        author: true,
        publisher: true,
        course: true,
        department: true,
        semester: true,
        institute: true,
      },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findContentById(id: string) {
    const content = await this.contentRepository.findOne({
      where: { id },
      relations: {
        category: true,
        subcategory: true,
        author: true,
        publisher: true,
        course: true,
        department: true,
        semester: true,
        institute: true,
      },
    });
    if (!content) {
      throw new NotFoundException('Digital content not found');
    }

    const [downloads, ratings, accesses] = await Promise.all([
      this.downloadRepository.count({ where: { contentId: id } }),
      this.ratingRepository.count({ where: { contentId: id } }),
      this.accessRepository.count({ where: { contentId: id } }),
    ]);

    return { ...content, downloads, ratings, accesses };
  }

  async createContent(dto: CreateDigitalContentDto, req: AdminRequest) {
    await this.validateReferences(dto);

    const content = this.contentRepository.create({
      ...cleanDto(dto),
      slug: dto.slug ?? slugify(dto.title, 'digital-content'),
      createdBy: req.user.id,
    });
    const saved = await this.contentRepository.save(content);

    await this.adminAuditService.log(
      req,
      'DIGITAL_CONTENT',
      'CREATE',
      'DigitalContent',
      saved.id,
      `Created digital content "${saved.title}"`,
      undefined,
      saved,
    );

    return { message: 'Digital content created successfully', content: saved };
  }

  async updateContent(
    id: string,
    dto: UpdateDigitalContentDto,
    req: AdminRequest,
  ) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException('Digital content not found');
    }

    await this.validateReferences(dto);

    const oldValue = { ...content };
    Object.assign(content, cleanDto(dto), { updatedBy: req.user.id });
    const saved = await this.contentRepository.save(content);

    await this.adminAuditService.log(
      req,
      'DIGITAL_CONTENT',
      'UPDATE',
      'DigitalContent',
      saved.id,
      `Updated digital content "${saved.title}"`,
      oldValue,
      saved,
    );

    return { message: 'Digital content updated successfully', content: saved };
  }

  async publishContent(
    id: string,
    dto: PublishDigitalContentDto,
    req: AdminRequest,
  ) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException('Digital content not found');
    }

    const oldValue = { ...content };
    if (dto.published) {
      content.status = DigitalContentStatus.ACTIVE;
      content.publishedAt = content.publishedAt ?? new Date();
    } else {
      content.status = DigitalContentStatus.DRAFT;
      // null (not undefined) so TypeORM clears the column in the UPDATE
      content.publishedAt = null;
    }
    content.updatedBy = req.user.id;
    const saved = await this.contentRepository.save(content);

    await this.adminAuditService.log(
      req,
      'DIGITAL_CONTENT',
      dto.published ? 'PUBLISH' : 'UNPUBLISH',
      'DigitalContent',
      saved.id,
      `${dto.published ? 'Published' : 'Unpublished'} digital content "${saved.title}"`,
      oldValue,
      saved,
    );

    return {
      message: dto.published
        ? 'Digital content published successfully'
        : 'Digital content unpublished successfully',
      content: saved,
    };
  }

  // ---------- ACCESS GRANT ----------

  // Grants a user direct access to premium content (ADMINGRANTED) without a
  // purchase or subscription. Duplicate active grants are updated in place so
  // re-granting never creates orphaned rows.
  async grantAccess(id: string, dto: GrantDigitalAccessDto, req: AdminRequest) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException('Digital content not found');
    }

    const existing = await this.accessRepository.findOne({
      where: { contentId: id, userId: dto.userId },
    });

    const oldValue = existing ? { ...existing } : undefined;
    const access =
      existing ??
      this.accessRepository.create({
        contentId: id,
        userId: dto.userId,
      });
    access.accessType = dto.accessType;
    access.grantedBy = req.user.id;
    access.grantedAt = new Date();
    access.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    access.status = DigitalAccessStatus.ACTIVE;
    const saved = await this.accessRepository.save(access);

    await this.adminAuditService.log(
      req,
      'DIGITAL_CONTENT',
      'ACCESS_GRANTED',
      'DigitalContent',
      id,
      `Granted ${dto.accessType} access to "${content.title}" for user ${dto.userId}`,
      oldValue,
      saved,
    );

    return {
      message: existing
        ? 'Access grant updated successfully'
        : 'Access granted successfully',
      access: saved,
    };
  }

  // ---------- REVIEW MODERATION ----------

  async findAllReviews(query: ListDigitalReviewQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.contentId) where.contentId = query.contentId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['title', 'body'],
      sortableFields: ['createdAt', 'rating', 'status'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.reviewRepository.findAndCount({
      ...options,
      relations: { content: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async moderateReview(
    id: string,
    dto: ModerateDigitalReviewDto,
    req: AdminRequest,
  ) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Digital content review not found');
    }

    const oldValue = { ...review };
    review.status = dto.status;
    review.moderatedBy = req.user.id;
    review.moderatedAt = new Date();
    const saved = await this.reviewRepository.save(review);

    // The moderator remark is carried in the audit trail, never written into
    // the reviewer's public body text.
    await this.adminAuditService.log(
      req,
      'DIGITAL_CONTENT',
      'MODERATE',
      'DigitalReview',
      saved.id,
      `Marked digital content review ${saved.status}${
        dto.remark ? ` (${dto.remark})` : ''
      }`,
      oldValue,
      saved,
    );

    return {
      message: 'Digital content review moderated successfully',
      review: saved,
    };
  }

  // ---------- EXAMS ----------

  async findAllExams(query: ListDigitalExamQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.contentId) where.contentId = query.contentId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['title'],
      sortableFields: ['title', 'createdAt', 'status'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.examRepository.findAndCount({
      ...options,
      relations: { content: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createExam(dto: CreateDigitalExamDto, req: AdminRequest) {
    if (dto.contentId) {
      const content = await this.contentRepository.findOne({
        where: { id: dto.contentId },
      });
      if (!content) {
        throw new BadRequestException(
          'Invalid contentId: digital content not found',
        );
      }
    }

    const exam = this.examRepository.create({
      ...cleanDto(dto),
      createdBy: req.user.id,
    });
    const saved = await this.examRepository.save(exam);

    await this.adminAuditService.log(
      req,
      'DIGITAL_CONTENT',
      'EXAM_CREATED',
      'DigitalExam',
      saved.id,
      `Created exam "${saved.title}"`,
      undefined,
      saved,
    );

    return { message: 'Exam created successfully', exam: saved };
  }

  // DRAFT -> ACTIVE | ACTIVE -> DRAFT (oversight toggle)
  async publishExam(
    id: string,
    dto: PublishDigitalContentDto,
    req: AdminRequest,
  ) {
    const exam = await this.examRepository.findOne({ where: { id } });
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    const oldValue = { ...exam };
    exam.status = dto.published
      ? DigitalExamStatus.ACTIVE
      : DigitalExamStatus.DRAFT;
    exam.updatedBy = req.user.id;
    const saved = await this.examRepository.save(exam);

    await this.adminAuditService.log(
      req,
      'DIGITAL_CONTENT',
      dto.published ? 'EXAM_PUBLISHED' : 'EXAM_UNPUBLISHED',
      'DigitalExam',
      saved.id,
      `${dto.published ? 'Published' : 'Unpublished'} exam "${saved.title}"`,
      oldValue,
      saved,
    );

    return {
      message: dto.published
        ? 'Exam published successfully'
        : 'Exam unpublished successfully',
      exam: saved,
    };
  }

  // ---------- CERTIFICATES ----------

  async findAllCertificates(query: ListDigitalCertificateQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['certificateCode'],
      sortableFields: ['certificateCode', 'issuedAt', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] =
      await this.certificateRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // Issues a certificate to a user (optionally tied to a completed exam).
  async issueCertificate(dto: IssueDigitalCertificateDto, req: AdminRequest) {
    if (dto.examId) {
      const exam = await this.examRepository.findOne({
        where: { id: dto.examId },
      });
      if (!exam) {
        throw new BadRequestException('Invalid examId: exam not found');
      }
    }

    const certificate = this.certificateRepository.create({
      certificateCode: this.nextCode('DCC'),
      examId: dto.examId,
      userId: dto.userId,
      issuedBy: req.user.id,
      issuedAt: new Date(),
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      status: DigitalCertificateStatus.ISSUED,
    });
    const saved = await this.certificateRepository.save(certificate);

    await this.adminAuditService.log(
      req,
      'DIGITAL_CONTENT',
      'CERTIFICATE_ISSUED',
      'DigitalCertificate',
      saved.id,
      `Issued certificate ${saved.certificateCode} to user ${dto.userId}`,
      undefined,
      saved,
    );

    return { message: 'Certificate issued successfully', certificate: saved };
  }

  // ---------- ANALYTICS + REPORTS ----------

  // Pre-computed analytics rows (populated by BI jobs). Live rollups are
  // surfaced per-content on findContentById (downloads / ratings / accesses).
  async findAllAnalytics(query: ListDigitalAnalyticsQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.period) where.period = query.period;
    if (query.contentId) where.contentId = query.contentId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      sortableFields: ['period', 'metric', 'value', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.analyticsRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAllReports(query: ListDigitalReportQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.reportType) where.reportType = query.reportType;
    if (query.title) where.title = query.title;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['title', 'reportCode'],
      sortableFields: ['title', 'reportCode', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.reportRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- REFERENCE DATA (metadata lookups) ----------

  async findCategories() {
    return this.categoryRepository.find({
      where: { status: DigitalCategoryStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findSubCategories(categoryId?: string) {
    return this.subCategoryRepository.find({
      where: {
        status: DigitalSubCategoryStatus.ACTIVE,
        ...(categoryId ? { categoryId } : {}),
      },
      order: { name: 'ASC' },
    });
  }

  async findAuthors() {
    return this.authorRepository.find({
      where: { status: DigitalAuthorStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findPublishers() {
    return this.publisherRepository.find({
      where: { status: DigitalPublisherStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findCourses() {
    return this.courseRepository.find({
      where: { status: DigitalCourseStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findDepartments() {
    return this.departmentRepository.find({
      where: { status: DigitalDepartmentStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findSemesters() {
    return this.semesterRepository.find({
      where: { status: DigitalSemesterStatus.ACTIVE },
      order: { createdAt: 'ASC' },
    });
  }

  async findInstitutes() {
    return this.instituteRepository.find({
      where: { status: DigitalInstituteStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  // ---------- PRIVATE HELPERS ----------

  private async validateReferences(
    dto: CreateDigitalContentDto | UpdateDigitalContentDto,
  ) {
    const checks: Array<
      [string | undefined, string, Repository<{ id: string }>]
    > = [
      [dto.categoryId, 'categoryId', this.categoryRepository],
      [dto.subcategoryId, 'subcategoryId', this.subCategoryRepository],
      [dto.authorId, 'authorId', this.authorRepository],
      [dto.publisherId, 'publisherId', this.publisherRepository],
      [dto.courseId, 'courseId', this.courseRepository],
      [dto.departmentId, 'departmentId', this.departmentRepository],
      [dto.semesterId, 'semesterId', this.semesterRepository],
      [dto.instituteId, 'instituteId', this.instituteRepository],
    ];
    for (const [value, field, repo] of checks) {
      if (value && !(await repo.findOne({ where: { id: value } }))) {
        throw new BadRequestException(`Invalid ${field}: record not found`);
      }
    }
  }

  private nextCode(prefix: string): string {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
  }
}
