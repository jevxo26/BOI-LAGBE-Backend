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
import { CustomOrdersService } from './custom-orders.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListCustomOrderQueryDto } from './dto/list-custom-order-query.dto';
import { UpdateCustomOrderStatusDto } from './dto/update-custom-order-status.dto';
import { CreateCustomQuotationDto } from './dto/create-custom-quotation.dto';
import { ApproveCustomOrderDto } from './dto/approve-custom-order.dto';
import { StartProductionDto } from './dto/start-production.dto';
import { AddProductionStageDto } from './dto/add-production-stage.dto';
import { UpdateProductionStageStatusDto } from './dto/update-production-stage-status.dto';
import { ScheduleCustomDeliveryDto } from './dto/schedule-custom-delivery.dto';
import { CreatePrintServiceDto } from './dto/create-print-service.dto';
import { CreatePrintJobDto } from './dto/create-print-job.dto';
import { UpdatePrintJobStatusDto } from './dto/update-print-job-status.dto';
import { ListPrintJobQueryDto } from './dto/list-print-job-query.dto';
import { ListCustomAnalyticsQueryDto } from './dto/list-custom-analytics-query.dto';
import { ListCustomReportQueryDto } from './dto/list-custom-report-query.dto';

// All custom-order routes require authentication (global StrictJwtAuthGuard)
// AND the ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before any parameterized :id route.
@ApiTags('Admin - Custom Orders')
@ApiBearerAuth()
@Controller('admin/custom-orders')
@AdminOnly()
export class CustomOrdersController {
  constructor(private readonly customOrdersService: CustomOrdersService) {}

  // ---------- PRINT SERVICES + PRINT JOBS (static routes first) ----------

  @Get('print-services')
  async findPrintServices() {
    return this.customOrdersService.findPrintServices();
  }

  @Post('print-services')
  async createPrintService(
    @Body() dto: CreatePrintServiceDto,
    @Req() req: AdminRequest,
  ) {
    return this.customOrdersService.createPrintService(dto, req);
  }

  @Get('print-jobs')
  async findAllPrintJobs(@Query() query: ListPrintJobQueryDto) {
    return this.customOrdersService.findAllPrintJobs(query);
  }

  @Post('print-jobs')
  async createPrintJob(
    @Body() dto: CreatePrintJobDto,
    @Req() req: AdminRequest,
  ) {
    return this.customOrdersService.createPrintJob(dto, req);
  }

  @Patch('print-jobs/:id/status')
  async updatePrintJobStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePrintJobStatusDto,
    @Req() req: AdminRequest,
  ) {
    return this.customOrdersService.updatePrintJobStatus(id, dto, req);
  }

  @Patch('production-stages/:id/status')
  async updateProductionStageStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductionStageStatusDto,
    @Req() req: AdminRequest,
  ) {
    return this.customOrdersService.updateProductionStageStatus(id, dto, req);
  }

  // ---------- ANALYTICS + REPORTS ----------

  @Get('analytics')
  async findAllAnalytics(@Query() query: ListCustomAnalyticsQueryDto) {
    return this.customOrdersService.findAllAnalytics(query);
  }

  @Get('reports')
  async findAllReports(@Query() query: ListCustomReportQueryDto) {
    return this.customOrdersService.findAllReports(query);
  }

  // ---------- ORDERS ----------

  @Get()
  async findAll(@Query() query: ListCustomOrderQueryDto) {
    return this.customOrdersService.findAllOrders(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customOrdersService.findOrderById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomOrderStatusDto,
    @Req() req: AdminRequest,
  ) {
    return this.customOrdersService.updateOrderStatus(id, dto, req);
  }

  @Post(':id/quotation')
  async createQuotation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCustomQuotationDto,
    @Req() req: AdminRequest,
  ) {
    return this.customOrdersService.createQuotation(id, dto, req);
  }

  @Post(':id/approve')
  async approveOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApproveCustomOrderDto,
    @Req() req: AdminRequest,
  ) {
    return this.customOrdersService.approveOrder(id, dto, req);
  }

  @Post(':id/production/start')
  async startProduction(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: StartProductionDto,
    @Req() req: AdminRequest,
  ) {
    return this.customOrdersService.startProduction(id, dto, req);
  }

  @Post(':id/production/stages')
  async addProductionStage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddProductionStageDto,
    @Req() req: AdminRequest,
  ) {
    return this.customOrdersService.addProductionStage(id, dto, req);
  }

  @Post(':id/delivery-schedule')
  async scheduleDelivery(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ScheduleCustomDeliveryDto,
    @Req() req: AdminRequest,
  ) {
    return this.customOrdersService.scheduleDelivery(id, dto, req);
  }
}
