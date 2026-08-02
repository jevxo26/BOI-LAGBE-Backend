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
import { RidersService } from './riders.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { PaginatedQueryDto } from '../common/dto/paginated-query.dto';
import { ListRiderQueryDto } from './dto/list-rider-query.dto';
import { CreateRiderDto } from './dto/create-rider.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';
import { UpdateRiderStatusDto } from './dto/update-rider-status.dto';
import { AssignRiderAreasDto } from './dto/assign-rider-areas.dto';
import { ListRiderDocumentQueryDto } from './dto/list-rider-document-query.dto';
import { VerifyRiderDocumentDto } from './dto/verify-rider-document.dto';
import { ListRiderVehicleQueryDto } from './dto/list-rider-vehicle-query.dto';
import { ListRiderRouteQueryDto } from './dto/list-rider-route-query.dto';
import { ListRiderAvailabilityQueryDto } from './dto/list-rider-availability-query.dto';
import { ListRiderShiftQueryDto } from './dto/list-rider-shift-query.dto';
import { ListRiderAttendanceQueryDto } from './dto/list-rider-attendance-query.dto';
import { ListRiderAssignmentQueryDto } from './dto/list-rider-assignment-query.dto';
import { ListRiderDeliveryQueryDto } from './dto/list-rider-delivery-query.dto';
import { ListRiderOtpQueryDto } from './dto/list-rider-otp-query.dto';
import { ListRiderProofQueryDto } from './dto/list-rider-proof-query.dto';
import { ListRiderEarningQueryDto } from './dto/list-rider-earning-query.dto';
import { ListRiderSettlementQueryDto } from './dto/list-rider-settlement-query.dto';
import { ListRiderWalletTransactionQueryDto } from './dto/list-rider-wallet-transaction-query.dto';
import { ListRiderPerformanceQueryDto } from './dto/list-rider-performance-query.dto';
import { ListRiderIncidentQueryDto } from './dto/list-rider-incident-query.dto';
import { ListRiderNotificationQueryDto } from './dto/list-rider-notification-query.dto';
import { ListRiderLeaveQueryDto } from './dto/list-rider-leave-query.dto';
import { ApproveRiderLeaveDto } from './dto/approve-rider-leave.dto';
import { CreateRiderBonusDto } from './dto/create-rider-bonus.dto';
import { CreateRiderPenaltyDto } from './dto/create-rider-penalty.dto';
import { ListRiderHistoryQueryDto } from './dto/list-rider-history-query.dto';
import { ListRiderAnalyticsQueryDto } from './dto/list-rider-analytics-query.dto';
import { ListRiderReportQueryDto } from './dto/list-rider-report-query.dto';

// All rider routes require authentication (global StrictJwtAuthGuard) AND the
// ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before the parameterized :id route.
@ApiTags('Admin - Riders')
@ApiBearerAuth()
@Controller('admin/riders')
@AdminOnly()
export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  // ---------- CORE CRUD ----------

  @Get()
  async findAll(@Query() query: ListRiderQueryDto) {
    return this.ridersService.findAllRiders(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ridersService.findRiderById(id);
  }

  @Post()
  async create(@Body() dto: CreateRiderDto, @Req() req: AdminRequest) {
    return this.ridersService.createRider(dto, req);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRiderDto,
    @Req() req: AdminRequest,
  ) {
    return this.ridersService.updateRider(id, dto, req);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRiderStatusDto,
    @Req() req: AdminRequest,
  ) {
    return this.ridersService.updateRiderStatus(id, dto, req);
  }

  @Post(':id/areas')
  async assignAreas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignRiderAreasDto,
    @Req() req: AdminRequest,
  ) {
    return this.ridersService.assignRiderAreas(id, dto, req);
  }

  // ---------- DOCUMENTS ----------

  @Get(':id/documents')
  async findDocuments(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderDocumentQueryDto,
  ) {
    return this.ridersService.findRiderDocuments(id, query);
  }

  @Patch('documents/:documentId/verify')
  async verifyDocument(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Body() dto: VerifyRiderDocumentDto,
    @Req() req: AdminRequest,
  ) {
    return this.ridersService.verifyRiderDocument(documentId, dto, req);
  }

  // ---------- VEHICLES / ROUTES / AVAILABILITY / SHIFTS / ATTENDANCE ----------

  @Get(':id/vehicles')
  async findVehicles(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderVehicleQueryDto,
  ) {
    return this.ridersService.findRiderVehicles(id, query);
  }

  @Get(':id/routes')
  async findRoutes(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderRouteQueryDto,
  ) {
    return this.ridersService.findRiderRoutes(id, query);
  }

  @Get(':id/availability')
  async findAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderAvailabilityQueryDto,
  ) {
    return this.ridersService.findRiderAvailability(id, query);
  }

  @Get(':id/shifts')
  async findShifts(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderShiftQueryDto,
  ) {
    return this.ridersService.findRiderShifts(id, query);
  }

  @Get(':id/attendance')
  async findAttendance(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderAttendanceQueryDto,
  ) {
    return this.ridersService.findRiderAttendance(id, query);
  }

  // ---------- ASSIGNMENTS / DELIVERIES ----------

  @Get(':id/assignments')
  async findAssignments(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderAssignmentQueryDto,
  ) {
    return this.ridersService.findRiderAssignments(id, query);
  }

  @Get(':id/deliveries')
  async findDeliveries(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderDeliveryQueryDto,
  ) {
    return this.ridersService.findRiderDeliveries(id, query);
  }

  // ---------- TRACKING / LOCATIONS / DELIVERY ATTEMPTS ----------

  @Get(':id/tracking')
  async findTracking(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.ridersService.findRiderTracking(id, query);
  }

  @Get(':id/locations')
  async findLocations(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.ridersService.findRiderLocationHistory(id, query);
  }

  @Get(':id/delivery-attempts')
  async findDeliveryAttempts(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.ridersService.findRiderDeliveryAttempts(id, query);
  }

  // ---------- OTP / PROOF ----------

  @Get(':id/otps')
  async findOtps(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderOtpQueryDto,
  ) {
    return this.ridersService.findRiderOtps(id, query);
  }

  @Get(':id/proofs')
  async findProofs(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderProofQueryDto,
  ) {
    return this.ridersService.findRiderProofs(id, query);
  }

  // ---------- EARNINGS / SETTLEMENTS ----------

  @Get(':id/earnings')
  async findEarnings(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderEarningQueryDto,
  ) {
    return this.ridersService.findRiderEarnings(id, query);
  }

  @Get(':id/settlements')
  async findSettlements(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderSettlementQueryDto,
  ) {
    return this.ridersService.findRiderSettlements(id, query);
  }

  // ---------- WALLET + TRANSACTIONS ----------

  @Get(':id/wallet')
  async findWallet(@Param('id', ParseUUIDPipe) id: string) {
    return this.ridersService.findRiderWallet(id);
  }

  @Get(':id/wallet/transactions')
  async findWalletTransactions(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderWalletTransactionQueryDto,
  ) {
    return this.ridersService.findRiderWalletTransactions(id, query);
  }

  // ---------- PENALTY / BONUS / RATING / PERFORMANCE ----------

  @Get(':id/penalties')
  async findPenalties(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.ridersService.findRiderPenalties(id, query);
  }

  @Post(':id/penalties')
  async createPenalty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateRiderPenaltyDto,
    @Req() req: AdminRequest,
  ) {
    return this.ridersService.createRiderPenalty(id, dto, req);
  }

  @Get(':id/bonuses')
  async findBonuses(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.ridersService.findRiderBonuses(id, query);
  }

  @Post(':id/bonuses')
  async createBonus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateRiderBonusDto,
    @Req() req: AdminRequest,
  ) {
    return this.ridersService.createRiderBonus(id, dto, req);
  }

  @Get(':id/ratings')
  async findRatings(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.ridersService.findRiderRatings(id, query);
  }

  @Get(':id/performance')
  async findPerformance(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderPerformanceQueryDto,
  ) {
    return this.ridersService.findRiderPerformance(id, query);
  }

  // ---------- INCIDENTS / NOTIFICATIONS / ANNOUNCEMENTS / LEAVE ----------

  @Get(':id/incidents')
  async findIncidents(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderIncidentQueryDto,
  ) {
    return this.ridersService.findRiderIncidents(id, query);
  }

  @Get(':id/notifications')
  async findNotifications(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderNotificationQueryDto,
  ) {
    return this.ridersService.findRiderNotifications(id, query);
  }

  @Get(':id/announcements')
  async findAnnouncements(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.ridersService.findRiderAnnouncements(id, query);
  }

  @Get(':id/leaves')
  async findLeaves(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderLeaveQueryDto,
  ) {
    return this.ridersService.findRiderLeaves(id, query);
  }

  @Patch('leaves/:leaveId/approve')
  async approveLeave(
    @Param('leaveId', ParseUUIDPipe) leaveId: string,
    @Body() dto: ApproveRiderLeaveDto,
    @Req() req: AdminRequest,
  ) {
    return this.ridersService.approveRiderLeave(leaveId, dto, req);
  }

  // ---------- HISTORY / ANALYTICS / REPORTS ----------

  @Get(':id/history')
  async findHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderHistoryQueryDto,
  ) {
    return this.ridersService.findRiderHistory(id, query);
  }

  @Get(':id/analytics')
  async findAnalytics(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderAnalyticsQueryDto,
  ) {
    return this.ridersService.findRiderAnalytics(id, query);
  }

  @Get(':id/reports')
  async findReports(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListRiderReportQueryDto,
  ) {
    return this.ridersService.findRiderReports(id, query);
  }
}
