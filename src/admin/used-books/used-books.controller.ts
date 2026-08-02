import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsedBooksService } from './used-books.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListUsedBookRequestQueryDto } from './dto/list-used-book-request-query.dto';
import { ReviewUsedBookRequestDto } from './dto/review-used-book-request.dto';
import { GenerateOfferDto } from './dto/generate-offer.dto';
import { ApproveOfferDto } from './dto/approve-offer.dto';
import { SchedulePickupDto } from './dto/schedule-pickup.dto';
import { InspectItemDto } from './dto/inspect-item.dto';
import { RepriceItemDto } from './dto/reprice-item.dto';
import { PublishItemDto } from './dto/publish-item.dto';
import { ListAuditLogQueryDto } from './dto/list-audit-log-query.dto';
import { ListUsedBookAnalyticsQueryDto } from './dto/list-used-book-analytics-query.dto';

// All used-book routes require authentication (global StrictJwtAuthGuard) AND
// the ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before any parameterized :id route.
@ApiTags('Admin - Used Books')
@ApiBearerAuth()
@Controller('admin/used-books')
@AdminOnly()
export class UsedBooksController {
  constructor(private readonly usedBooksService: UsedBooksService) {}

  // ---------- REJECT REASONS + AUDIT TRAIL (static routes first) ----------

  @Get('reject-reasons')
  async findRejectReasons() {
    return this.usedBooksService.findRejectReasons();
  }

  @Get('audit-logs')
  async findAuditLogs(@Query() query: ListAuditLogQueryDto) {
    return this.usedBooksService.findAuditLogs(query);
  }

  @Get('analytics')
  async findAnalytics(@Query() query: ListUsedBookAnalyticsQueryDto) {
    return this.usedBooksService.findAnalytics(query);
  }

  // ---------- SELL REQUESTS ----------

  @Get('requests')
  async findAllRequests(@Query() query: ListUsedBookRequestQueryDto) {
    return this.usedBooksService.findAllRequests(query);
  }

  @Get('requests/:id')
  async findRequestById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usedBooksService.findRequestById(id);
  }

  @Post('requests/:id/review')
  async reviewRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReviewUsedBookRequestDto,
    @Req() req: AdminRequest,
  ) {
    return this.usedBooksService.reviewRequest(id, dto, req);
  }

  // ---------- ITEMS (evaluation / offer / approval / inspection / pricing) ----------

  @Post('items/:id/offer')
  async generateOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: GenerateOfferDto,
    @Req() req: AdminRequest,
  ) {
    return this.usedBooksService.generateOffer(id, dto, req);
  }

  @Post('items/:id/approve')
  async approveOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApproveOfferDto,
    @Req() req: AdminRequest,
  ) {
    return this.usedBooksService.approveOffer(id, dto, req);
  }

  @Post('items/:id/inspection')
  async inspectItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: InspectItemDto,
    @Req() req: AdminRequest,
  ) {
    return this.usedBooksService.inspectItem(id, dto, req);
  }

  @Post('items/:id/reprice')
  async repriceItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RepriceItemDto,
    @Req() req: AdminRequest,
  ) {
    return this.usedBooksService.repriceItem(id, dto, req);
  }

  @Post('items/:id/publish')
  async publishItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PublishItemDto,
    @Req() req: AdminRequest,
  ) {
    return this.usedBooksService.publishItem(id, dto, req);
  }

  // ---------- PICKUP ----------

  // The :id is the sell request id — schedules (or re-schedules) its pickup.
  @Post('pickups/:id/schedule')
  async schedulePickup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SchedulePickupDto,
    @Req() req: AdminRequest,
  ) {
    return this.usedBooksService.schedulePickup(id, dto, req);
  }
}
