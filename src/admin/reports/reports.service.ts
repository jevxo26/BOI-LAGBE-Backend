import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryBuilder } from '../common/utils/query-builder';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListDashboardQueryDto } from './dto/list-dashboard-query.dto';
import { ListKpiQueryDto } from './dto/list-kpi-query.dto';
import { ListSalesAnalyticsQueryDto } from './dto/list-sales-analytics-query.dto';
import { ListRevenueAnalyticsQueryDto } from './dto/list-revenue-analytics-query.dto';
import { ListCustomReportQueryDto } from './dto/list-custom-report-query.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ExportReportDto } from './dto/export-report.dto';
import {
  Dashboard,
  KPI,
  SalesAnalytics,
  RevenueAnalytics,
  GeneratedReport,
  GeneratedReportStatus,
  ReportTemplate,
  ExportHistory,
  ExportStatus,
} from './entities';

// Admin BI/analytics oversight. The analytics snapshots are populated by
// BI jobs; this module lists them and manages report generation/export.
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Dashboard)
    private readonly dashboardRepository: Repository<Dashboard>,
    @InjectRepository(KPI)
    private readonly kpiRepository: Repository<KPI>,
    @InjectRepository(SalesAnalytics)
    private readonly salesRepository: Repository<SalesAnalytics>,
    @InjectRepository(RevenueAnalytics)
    private readonly revenueRepository: Repository<RevenueAnalytics>,
    @InjectRepository(GeneratedReport)
    private readonly generatedReportRepository: Repository<GeneratedReport>,
    @InjectRepository(ReportTemplate)
    private readonly templateRepository: Repository<ReportTemplate>,
    @InjectRepository(ExportHistory)
    private readonly exportRepository: Repository<ExportHistory>,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- DASHBOARDS ----------

  async findAllDashboards(query: ListDashboardQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      searchableFields: ['name', 'dashboardCode'],
      sortableFields: ['name', 'sortOrder', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.dashboardRepository.findAndCount({
      ...options,
      relations: { widgets: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- KPIs ----------

  async findAllKpis(query: ListKpiQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.periodType) where.periodType = query.periodType;
    if (query.category) where.category = query.category;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      searchableFields: ['kpiCode', 'name'],
      sortableFields: ['kpiCode', 'name', 'value', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.kpiRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- ANALYTICS ----------

  async findAllSalesAnalytics(query: ListSalesAnalyticsQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.periodType) where.periodType = query.periodType;
    if (query.period) where.period = query.period;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'generatedAt',
      sortableFields: ['period', 'periodType', 'totalSales', 'generatedAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.salesRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAllRevenueAnalytics(query: ListRevenueAnalyticsQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.periodType) where.periodType = query.periodType;
    if (query.period) where.period = query.period;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'generatedAt',
      sortableFields: ['period', 'periodType', 'netRevenue', 'generatedAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.revenueRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- CUSTOM REPORTS ----------

  // Lists GeneratedReport rows — the on-demand report runs produced via
  // the generate endpoint (or by scheduled jobs).
  async findAllCustomReports(query: ListCustomReportQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.reportType) where.reportType = query.reportType;
    if (query.status) where.status = query.status;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['title', 'reportCode'],
      sortableFields: ['title', 'reportCode', 'status', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.generatedReportRepository.findAndCount({
      ...options,
      relations: { template: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- GENERATE / EXPORT ----------

  // Queues a report run: validates the template (if given) and creates a
  // GeneratedReport record marked as GENERATING.
  async generateReport(dto: GenerateReportDto, req: AdminRequest) {
    if (dto.templateId) {
      const template = await this.templateRepository.findOne({
        where: { id: dto.templateId },
      });
      if (!template) {
        throw new NotFoundException('Report template not found');
      }
      if (template.reportType !== dto.reportType) {
        throw new BadRequestException(
          `Template reportType (${template.reportType}) does not match ${dto.reportType}`,
        );
      }
    }

    const report = await this.generatedReportRepository.save(
      this.generatedReportRepository.create({
        reportCode: this.nextCode('RPT'),
        templateId: dto.templateId,
        reportType: dto.reportType,
        title: dto.title,
        periodStart: dto.periodStart,
        periodEnd: dto.periodEnd,
        params: dto.params,
        status: GeneratedReportStatus.GENERATING,
        generatedBy: req.user.id,
      }),
    );

    await this.adminAuditService.log(
      req,
      'REPORTS',
      'REPORT_GENERATED',
      'GeneratedReport',
      report.id,
      `Queued report generation ${report.title} (${report.reportType})`,
      undefined,
      report,
    );
    return { message: 'Report generation queued successfully', report };
  }

  // Records a report export request (artifact metadata only — no file
  // generation/streaming in this module).
  async exportReport(dto: ExportReportDto, req: AdminRequest) {
    const exportRecord = await this.exportRepository.save(
      this.exportRepository.create({
        exportCode: this.nextCode('EXP'),
        reportType: dto.reportType,
        format: dto.format,
        periodStart: dto.periodStart,
        periodEnd: dto.periodEnd,
        filters: dto.filters,
        status: ExportStatus.QUEUED,
        requestedBy: req.user.id,
      }),
    );

    await this.adminAuditService.log(
      req,
      'REPORTS',
      'REPORT_EXPORTED',
      'ExportHistory',
      exportRecord.id,
      `Queued ${dto.format} export for ${dto.reportType}`,
      undefined,
      exportRecord,
    );
    return {
      message: 'Report export queued successfully',
      export: exportRecord,
    };
  }

  // ---------- PRIVATE HELPERS ----------

  private nextCode(prefix: string): string {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
  }
}
