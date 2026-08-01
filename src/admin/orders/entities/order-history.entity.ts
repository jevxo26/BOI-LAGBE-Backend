import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

// Human-readable timeline of every admin action on an order, also exposed as
// the module's audit trail.
@Entity('order_histories')
export class OrderHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  performedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
