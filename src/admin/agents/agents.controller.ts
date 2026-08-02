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
import { AgentsService } from './agents.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UpdateAgentStatusDto } from './dto/update-agent-status.dto';
import { ListAgentQueryDto } from './dto/list-agent-query.dto';
import { AssignAgentAreasDto } from './dto/assign-agent-areas.dto';
import { AssignAgentInstitutesDto } from './dto/assign-agent-institutes.dto';
import { ListAgentPerformanceQueryDto } from './dto/list-agent-performance-query.dto';
import { ListAgentSalaryQueryDto } from './dto/list-agent-salary-query.dto';
import { ListAgentCommissionQueryDto } from './dto/list-agent-commission-query.dto';
import { ListAgentSettlementQueryDto } from './dto/list-agent-settlement-query.dto';
import { ListAgentWalletTransactionQueryDto } from './dto/list-agent-wallet-transaction-query.dto';
import { ListAgentDocumentQueryDto } from './dto/list-agent-document-query.dto';
import { VerifyAgentDocumentDto } from './dto/verify-agent-document.dto';
import { ListAgentLeaveQueryDto } from './dto/list-agent-leave-query.dto';
import { ApproveAgentLeaveDto } from './dto/approve-agent-leave.dto';
import { ListAgentAttendanceQueryDto } from './dto/list-agent-attendance-query.dto';
import { CreateAgentBonusDto } from './dto/create-agent-bonus.dto';
import { CreateAgentPenaltyDto } from './dto/create-agent-penalty.dto';
import { CreateAgentAnnouncementDto } from './dto/create-agent-announcement.dto';
import { PaginatedQueryDto } from '../common/dto/paginated-query.dto';

// All agent routes require authentication (global StrictJwtAuthGuard) AND the
// ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
@ApiTags('Admin - Agents')
@ApiBearerAuth()
@Controller('admin/agents')
@AdminOnly()
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  async findAll(@Query() query: ListAgentQueryDto) {
    return this.agentsService.findAllAgents(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.agentsService.findAgentById(id);
  }

  @Post()
  async create(@Body() dto: CreateAgentDto, @Req() req: AdminRequest) {
    return this.agentsService.createAgent(dto, req);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAgentDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.updateAgent(id, dto, req);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAgentStatusDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.updateAgentStatus(id, dto, req);
  }

  @Post(':id/areas')
  async assignAreas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignAgentAreasDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.assignAgentAreas(id, dto, req);
  }

  @Post(':id/institutes')
  async assignInstitutes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignAgentInstitutesDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.assignAgentInstitutes(id, dto, req);
  }

  // ---------- PERFORMANCE / SALARY / COMMISSION / SETTLEMENT ----------

  @Get(':id/performance')
  async findPerformance(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListAgentPerformanceQueryDto,
  ) {
    return this.agentsService.findAgentPerformance(id, query);
  }

  @Get(':id/salaries')
  async findSalaries(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListAgentSalaryQueryDto,
  ) {
    return this.agentsService.findAgentSalaries(id, query);
  }

  @Get(':id/commissions')
  async findCommissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListAgentCommissionQueryDto,
  ) {
    return this.agentsService.findAgentCommissions(id, query);
  }

  @Get(':id/settlements')
  async findSettlements(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListAgentSettlementQueryDto,
  ) {
    return this.agentsService.findAgentSettlements(id, query);
  }

  // ---------- WALLET + TRANSACTIONS ----------

  @Get(':id/wallet')
  async findWallet(@Param('id', ParseUUIDPipe) id: string) {
    return this.agentsService.findAgentWallet(id);
  }

  @Get(':id/wallet/transactions')
  async findWalletTransactions(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListAgentWalletTransactionQueryDto,
  ) {
    return this.agentsService.findAgentWalletTransactions(id, query);
  }

  // ---------- DOCUMENTS ----------

  @Get(':id/documents')
  async findDocuments(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListAgentDocumentQueryDto,
  ) {
    return this.agentsService.findAgentDocuments(id, query);
  }

  @Patch('documents/:documentId/verify')
  async verifyDocument(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Body() dto: VerifyAgentDocumentDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.verifyAgentDocument(documentId, dto, req);
  }

  // ---------- LEAVE ----------

  @Get(':id/leaves')
  async findLeaves(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListAgentLeaveQueryDto,
  ) {
    return this.agentsService.findAgentLeaves(id, query);
  }

  @Patch('leaves/:leaveId/approve')
  async approveLeave(
    @Param('leaveId', ParseUUIDPipe) leaveId: string,
    @Body() dto: ApproveAgentLeaveDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.approveAgentLeave(leaveId, dto, req);
  }

  // ---------- ATTENDANCE ----------

  @Get(':id/attendance')
  async findAttendance(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListAgentAttendanceQueryDto,
  ) {
    return this.agentsService.findAgentAttendance(id, query);
  }

  // ---------- BONUS / PENALTY / ANNOUNCEMENT ----------

  @Get(':id/bonuses')
  async findBonuses(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.agentsService.findAgentBonuses(id, query);
  }

  @Post(':id/bonuses')
  async createBonus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateAgentBonusDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.createAgentBonus(id, dto, req);
  }

  @Get(':id/penalties')
  async findPenalties(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.agentsService.findAgentPenalties(id, query);
  }

  @Post(':id/penalties')
  async createPenalty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateAgentPenaltyDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.createAgentPenalty(id, dto, req);
  }

  @Get(':id/announcements')
  async findAnnouncements(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.agentsService.findAgentAnnouncements(id, query);
  }

  @Post(':id/announcements')
  async createAnnouncement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateAgentAnnouncementDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.createAgentAnnouncement(id, dto, req);
  }
}
