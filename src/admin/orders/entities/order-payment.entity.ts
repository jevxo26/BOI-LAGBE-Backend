import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum OrderPaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Payment record for an order. No payment gateway integration — records only.
@Entity('order_payments')
export class OrderPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  userId: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true })
  reference?: string;

  @Column({
    type: 'enum',
    enum: OrderPaymentStatus,
    default: OrderPaymentStatus.PENDING,
  })
  status: OrderPaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
