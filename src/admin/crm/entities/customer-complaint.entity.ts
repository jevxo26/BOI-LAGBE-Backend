import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

// Formal customer complaint raised against an order or service.
@Entity('customer_complaints')
export class CustomerComplaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  complaintCode: string;

  @Column()
  customerId: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.OPEN,
  })
  status: ComplaintStatus;

  @Column({ nullable: true })
  resolvedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  resolutionNote?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
