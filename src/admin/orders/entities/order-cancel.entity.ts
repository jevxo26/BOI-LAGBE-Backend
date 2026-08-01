import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_cancels')
export class OrderCancel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  userId: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ nullable: true })
  cancelledBy?: string;

  @Column({ type: 'timestamp' })
  cancelledAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
