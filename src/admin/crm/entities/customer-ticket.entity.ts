import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketCategory } from './ticket-category.entity';
import { TicketPriority } from './ticket-priority.entity';
import { TicketStatus } from './ticket-status.entity';

export enum TicketChannel {
  APP = 'APP',
  WEB = 'WEB',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  OTHER = 'OTHER',
}

// Customer support ticket with its status/priority/category lookups.
@Entity('customer_tickets')
export class CustomerTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  ticketCode: string;

  @Column()
  customerId: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  categoryId?: string;

  @ManyToOne(() => TicketCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category?: TicketCategory;

  @Column({ nullable: true })
  priorityId?: string;

  @ManyToOne(() => TicketPriority, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'priorityId' })
  priority?: TicketPriority;

  @Column({ nullable: true })
  statusId?: string;

  @ManyToOne(() => TicketStatus, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'statusId' })
  status?: TicketStatus;

  @Column({ type: 'enum', enum: TicketChannel, default: TicketChannel.APP })
  channel: TicketChannel;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  assignedTo?: string;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  firstResponseAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastReplyAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date | null;

  @Column({ type: 'int', nullable: true })
  rating?: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
