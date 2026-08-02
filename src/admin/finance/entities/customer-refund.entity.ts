import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CustomerRefundStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PROCESSED = 'PROCESSED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

// Money returned to a customer (order return / cancellation refund).
@Entity('customer_refunds')
export class CustomerRefund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  refundCode: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ nullable: true })
  method?: string;

  @Column({
    type: 'enum',
    enum: CustomerRefundStatus,
    default: CustomerRefundStatus.PENDING,
  })
  status: CustomerRefundStatus;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date | null;

  @Column({ nullable: true })
  processedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
