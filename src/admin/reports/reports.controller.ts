import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListDashboardQueryDto } from './dto/list-dashboard-query.dto';
import { ListKpiQueryDto } from './dto/list-kpi-query.dto';
import { ListSalesAnalyticsQueryDto } from './dto/list-sales-analytics-query.dto';
import { ListRevenueAnalyticsQueryDto } from './dto/list-revenue-analytics-query.dto';
import { ListCustomReportQueryDto } from './dto/list-custom-report-query.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ExportReportDto } from './dto/export-report.dto';

// All reports routes require authentication (global StrictJwtAuthGuard) AND
// the ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
@ApiTags('Admin - Reports')
@ApiBearerAuth()
@Controller('admin/reports')
@AdminOnly()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboards')
  async findAllDashboards(@Query() query: ListDashboardQueryDto) {
    return this.reportsService.findAllDashboards(query);
  }

  @Get('kpis')
  async findAllKpis(@Query() query: ListKpiQueryDto) {
    return this.reportsService.findAllKpis(query);
  }

  @Get('sales')
  async findAllSales(@Query() query: ListSalesAnalyticsQueryDto) {
    return this.reportsService.findAllSalesAnalytics(query);
  }

  @Get('revenue')
  async findAllRevenue(@Query() query: ListRevenueAnalyticsQueryDto) {
    return this.reportsService.findAllRevenueAnalytics(query);
  }

  @Get('custom')
  async findAllCustom(@Query() query: ListCustomReportQueryDto) {
    return this.reportsService.findAllCustomReports(query);
  }

  @Post('generate')
  async generateReport(
    @Body() dto: GenerateReportDto,
    @Req() req: AdminRequest,
  ) {
    return this.reportsService.generateReport(dto, req);
  }

  @Post('export')
  async exportReport(@Body() dto: ExportReportDto, @Req() req: AdminRequest) {
    return this.reportsService.exportReport(dto, req);
  }
}
