import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum TicketCategory {
  ACCOUNT = 'ACCOUNT',
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  BOOK = 'BOOK',
  DELIVERY = 'DELIVERY',
  PDF = 'PDF',
  CUSTOM_PRODUCT = 'CUSTOM_PRODUCT',
  OTHER = 'OTHER',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  ticketNumber: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.supportTickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: TicketCategory })
  category: TicketCategory;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column({ nullable: true })
  assignedTo?: string;

  @Column({ type: 'timestamp', nullable: true })
  closedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
