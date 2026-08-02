import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerTicket } from './customer-ticket.entity';

// Assignment/reassignment history of a ticket to support staff.
@Entity('ticket_assignments')
export class TicketAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ticketId: string;

  @ManyToOne(() => CustomerTicket, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId' })
  ticket: CustomerTicket;

  @Column()
  assignedTo: string;

  @Column()
  assignedBy: string;

  @Column({ type: 'timestamp' })
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  unassignedAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt: Date;
}
