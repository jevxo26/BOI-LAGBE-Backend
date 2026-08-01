import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

// History of status changes for an order (who set which status, when).
@Entity('order_statuses')
export class OrderStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  status: string;

  @Column({ nullable: true })
  changedBy?: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'timestamp' })
  changedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
