import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum OrderReturnStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
}

@Entity('order_returns')
export class OrderReturn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  returnCode: string;

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
    enum: OrderReturnStatus,
    default: OrderReturnStatus.REQUESTED,
  })
  status: OrderReturnStatus;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  requestedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
