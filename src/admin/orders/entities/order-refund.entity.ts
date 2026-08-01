import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum OrderRefundStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Refund record for an order. No payment gateway integration — records only.
@Entity('order_refunds')
export class OrderRefund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  refundCode: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ nullable: true })
  paymentId?: string;

  @Column()
  userId: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ nullable: true })
  method?: string;

  @Column({
    type: 'enum',
    enum: OrderRefundStatus,
    default: OrderRefundStatus.PENDING,
  })
  status: OrderRefundStatus;

  @Column({ nullable: true })
  processedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
