import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerTicket } from './customer-ticket.entity';

// A reply/message within a support ticket thread.
@Entity('ticket_replies')
export class TicketReply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ticketId: string;

  @ManyToOne(() => CustomerTicket, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId' })
  ticket: CustomerTicket;

  @Column({ nullable: true })
  adminId?: string;

  @Column({ nullable: true })
  customerId?: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isInternal: boolean;

  @Column({ default: false })
  isFromCustomer: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
