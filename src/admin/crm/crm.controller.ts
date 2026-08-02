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
import { CrmService } from './crm.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListTicketQueryDto } from './dto/list-ticket-query.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { ReplyToTicketDto } from './dto/reply-to-ticket.dto';
import { ListLiveChatQueryDto } from './dto/list-live-chat-query.dto';
import { ListNotificationQueryDto } from './dto/list-notification-query.dto';
import { ListLoyaltyQueryDto } from './dto/list-loyalty-query.dto';

// All CRM routes require authentication (global StrictJwtAuthGuard) AND the
// ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before any parameterized :id route.
@ApiTags('Admin - CRM')
@ApiBearerAuth()
@Controller('admin/crm')
@AdminOnly()
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  // ---------- TICKETS ----------

  @Get('tickets')
  async findAllTickets(@Query() query: ListTicketQueryDto) {
    return this.crmService.findAllTickets(query);
  }

  @Get('tickets/:id')
  async findTicketById(@Param('id', ParseUUIDPipe) id: string) {
    return this.crmService.findTicketById(id);
  }

  @Patch('tickets/:id/status')
  async updateTicketStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTicketStatusDto,
    @Req() req: AdminRequest,
  ) {
    return this.crmService.updateTicketStatus(id, dto, req);
  }

  @Post('tickets/:id/reply')
  async replyToTicket(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReplyToTicketDto,
    @Req() req: AdminRequest,
  ) {
    return this.crmService.replyToTicket(id, dto, req);
  }

  // ---------- LIVE CHAT ----------

  @Get('live-chat')
  async findAllLiveChats(@Query() query: ListLiveChatQueryDto) {
    return this.crmService.findAllLiveChats(query);
  }

  @Get('live-chat/:id')
  async findLiveChatById(@Param('id', ParseUUIDPipe) id: string) {
    return this.crmService.findLiveChatById(id);
  }

  // ---------- NOTIFICATIONS ----------

  @Get('notifications')
  async findAllNotifications(@Query() query: ListNotificationQueryDto) {
    return this.crmService.findAllNotifications(query);
  }

  // ---------- LOYALTY ----------

  @Get('loyalty')
  async findAllLoyalty(@Query() query: ListLoyaltyQueryDto) {
    return this.crmService.findAllLoyalty(query);
  }
}
