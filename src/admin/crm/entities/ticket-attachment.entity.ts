import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerTicket } from './customer-ticket.entity';

// File attached to a support ticket (or one of its replies).
@Entity('ticket_attachments')
export class TicketAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ticketId: string;

  @ManyToOne(() => CustomerTicket, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId' })
  ticket: CustomerTicket;

  @Column({ nullable: true })
  replyId?: string;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  fileType?: string;

  @Column({ type: 'int', nullable: true })
  fileSize?: number | null;

  @Column({ nullable: true })
  uploadedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
