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
import { OrdersService } from './orders.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListOrderQueryDto } from './dto/list-order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AssignAgentDto } from './dto/assign-agent.dto';
import { AssignRiderDto } from './dto/assign-rider.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateOrderReturnDto } from './dto/create-order-return.dto';
import { CreateOrderRefundDto } from './dto/create-order-refund.dto';
import { CreateOrderExchangeDto } from './dto/create-order-exchange.dto';
import { ListOrderReturnQueryDto } from './dto/list-order-return-query.dto';
import { ListOrderAnalyticsQueryDto } from './dto/list-order-analytics-query.dto';
import { ListOrderReportQueryDto } from './dto/list-order-report-query.dto';

// All order routes require authentication (global StrictJwtAuthGuard) AND
// the ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before any parameterized :id route.
@Controller('admin/orders')
@AdminOnly()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ---------- RETURNS / ANALYTICS / REPORTS (static routes first) ----------

  @Get('returns')
  async findAllReturns(@Query() query: ListOrderReturnQueryDto) {
    return this.ordersService.findAllReturns(query);
  }

  @Get('analytics')
  async findAllAnalytics(@Query() query: ListOrderAnalyticsQueryDto) {
    return this.ordersService.findAllAnalytics(query);
  }

  @Get('reports')
  async findAllReports(@Query() query: ListOrderReportQueryDto) {
    return this.ordersService.findAllReports(query);
  }

  // ---------- ORDERS ----------

  @Get()
  async findAll(@Query() query: ListOrderQueryDto) {
    return this.ordersService.findAllOrders(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOrderById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req: AdminRequest,
  ) {
    return this.ordersService.updateOrderStatus(id, dto, req);
  }

  @Post(':id/assign-agent')
  async assignAgent(
    @Param('id') id: string,
    @Body() dto: AssignAgentDto,
    @Req() req: AdminRequest,
  ) {
    return this.ordersService.assignAgent(id, dto, req);
  }

  @Post(':id/assign-rider')
  async assignRider(
    @Param('id') id: string,
    @Body() dto: AssignRiderDto,
    @Req() req: AdminRequest,
  ) {
    return this.ordersService.assignRider(id, dto, req);
  }

  @Post(':id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @Body() dto: CancelOrderDto,
    @Req() req: AdminRequest,
  ) {
    return this.ordersService.cancelOrder(id, dto, req);
  }

  @Post(':id/return')
  async createReturn(
    @Param('id') id: string,
    @Body() dto: CreateOrderReturnDto,
    @Req() req: AdminRequest,
  ) {
    return this.ordersService.createReturn(id, dto, req);
  }

  @Post(':id/refund')
  async createRefund(
    @Param('id') id: string,
    @Body() dto: CreateOrderRefundDto,
    @Req() req: AdminRequest,
  ) {
    return this.ordersService.createRefund(id, dto, req);
  }

  @Post(':id/exchange')
  async createExchange(
    @Param('id') id: string,
    @Body() dto: CreateOrderExchangeDto,
    @Req() req: AdminRequest,
  ) {
    return this.ordersService.createExchange(id, dto, req);
  }
}
