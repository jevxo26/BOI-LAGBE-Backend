import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum OrderExchangeStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

@Entity('order_exchanges')
export class OrderExchange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  exchangeCode: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  userId: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: OrderExchangeStatus,
    default: OrderExchangeStatus.REQUESTED,
  })
  status: OrderExchangeStatus;

  @Column({ nullable: true })
  processedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
