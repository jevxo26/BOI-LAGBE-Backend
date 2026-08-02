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
import { ListTicketQueryDto } from './dto/list-ticket-query.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { ReplyToTicketDto } from './dto/reply-to-ticket.dto';
import { ListLiveChatQueryDto } from './dto/list-live-chat-query.dto';
import { ListNotificationQueryDto } from './dto/list-notification-query.dto';
import { ListLoyaltyQueryDto } from './dto/list-loyalty-query.dto';
import {
  CustomerTicket,
  TicketStatus,
  TicketReply,
  TicketAttachment,
  TicketAssignment,
  LiveChat,
  ChatMessage,
  Notification,
  LoyaltyPointHistory,
} from './entities';

// Admin support/CRM oversight. Ticket mutations are audit-logged via
// AdminAuditService; chat/notification/loyalty are read-side visibility.
@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(CustomerTicket)
    private readonly ticketRepository: Repository<CustomerTicket>,
    @InjectRepository(TicketStatus)
    private readonly statusRepository: Repository<TicketStatus>,
    @InjectRepository(TicketReply)
    private readonly replyRepository: Repository<TicketReply>,
    @InjectRepository(TicketAttachment)
    private readonly attachmentRepository: Repository<TicketAttachment>,
    @InjectRepository(TicketAssignment)
    private readonly assignmentRepository: Repository<TicketAssignment>,
    @InjectRepository(LiveChat)
    private readonly chatRepository: Repository<LiveChat>,
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(LoyaltyPointHistory)
    private readonly loyaltyRepository: Repository<LoyaltyPointHistory>,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- TICKETS ----------

  async findAllTickets(query: ListTicketQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.statusId) where.statusId = query.statusId;
    if (query.priorityId) where.priorityId = query.priorityId;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.assignedTo) where.assignedTo = query.assignedTo;
    if (query.customerId) where.customerId = query.customerId;
    if (query.channel) where.channel = query.channel;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['ticketCode', 'subject'],
      sortableFields: ['ticketCode', 'subject', 'createdAt', 'updatedAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.ticketRepository.findAndCount({
      ...options,
      relations: { category: true, priority: true, status: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findTicketById(id: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: { category: true, priority: true, status: true },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const [replies, attachments, assignments] = await Promise.all([
      this.replyRepository.find({
        where: { ticketId: id },
        order: { createdAt: 'ASC' },
        take: 200,
      }),
      this.attachmentRepository.find({ where: { ticketId: id } }),
      this.assignmentRepository.find({
        where: { ticketId: id },
        order: { createdAt: 'DESC' },
        take: 50,
      }),
    ]);
    return { ...ticket, replies, attachments, assignments };
  }

  // Sets a ticket status (validated against the lookup table) and stamps
  // resolvedAt when the target status is a resolved one.
  async updateTicketStatus(
    id: string,
    dto: UpdateTicketStatusDto,
    req: AdminRequest,
  ) {
    const ticket = await this.getTicketOrThrow(id);

    const status = await this.statusRepository.findOne({
      where: { id: dto.statusId },
    });
    if (!status) {
      throw new BadRequestException('Ticket status not found');
    }

    const oldValue = { ...ticket };
    ticket.statusId = status.id;
    if (this.isResolvedCode(status.code)) {
      ticket.resolvedAt = ticket.resolvedAt ?? new Date();
    }
    const saved = await this.ticketRepository.save(ticket);

    await this.adminAuditService.log(
      req,
      'CRM',
      'TICKET_STATUS_UPDATED',
      'CustomerTicket',
      id,
      `Ticket ${ticket.ticketCode} status changed to ${status.name}${
        dto.remarks ? ` (${dto.remarks})` : ''
      }`,
      oldValue,
      saved,
    );
    return { message: 'Ticket status updated successfully', ticket: saved };
  }

  // Adds a reply to the ticket thread and stamps first/last response times.
  async replyToTicket(id: string, dto: ReplyToTicketDto, req: AdminRequest) {
    const ticket = await this.getTicketOrThrow(id);

    const reply = await this.replyRepository.save(
      this.replyRepository.create({
        ticketId: id,
        adminId: req.user.id,
        message: dto.message,
        isInternal: dto.isInternal ?? false,
        isFromCustomer: false,
      }),
    );

    ticket.firstResponseAt = ticket.firstResponseAt ?? new Date();
    ticket.lastReplyAt = new Date();
    const saved = await this.ticketRepository.save(ticket);

    await this.adminAuditService.log(
      req,
      'CRM',
      'TICKET_REPLIED',
      'CustomerTicket',
      id,
      `Replied to ticket ${ticket.ticketCode}`,
      undefined,
      saved,
    );
    return { message: 'Reply added successfully', reply, ticket: saved };
  }

  // ---------- LIVE CHAT ----------

  async findAllLiveChats(query: ListLiveChatQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.customerId) where.customerId = query.customerId;
    if (query.assignedTo) where.assignedTo = query.assignedTo;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['chatCode'],
      sortableFields: ['chatCode', 'status', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.chatRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findLiveChatById(id: string) {
    const chat = await this.chatRepository.findOne({ where: { id } });
    if (!chat) {
      throw new NotFoundException('Live chat not found');
    }

    const messages = await this.messageRepository.find({
      where: { chatId: id },
      order: { createdAt: 'ASC' },
      take: 200,
    });
    return { ...chat, messages };
  }

  // ---------- NOTIFICATIONS ----------

  async findAllNotifications(query: ListNotificationQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.userId) where.userId = query.userId;
    if (query.type) where.type = query.type;
    if (query.channel) where.channel = query.channel;
    if (query.status) where.status = query.status;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['title'],
      sortableFields: ['title', 'type', 'status', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] =
      await this.notificationRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- LOYALTY ----------

  async findAllLoyalty(query: ListLoyaltyQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.customerId) where.customerId = query.customerId;
    if (query.pointType) where.pointType = query.pointType;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      sortableFields: ['points', 'pointType', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.loyaltyRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- PRIVATE HELPERS ----------

  private async getTicketOrThrow(id: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  // Resolved-ish status codes get a resolvedAt stamp. Keep in sync with the
  // ticket_statuses lookup seed data.
  private isResolvedCode(code: string): boolean {
    return ['RESOLVED', 'CLOSED'].includes(code.toUpperCase());
  }
}
