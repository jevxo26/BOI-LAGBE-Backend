import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_discounts')
export class OrderDiscount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  title: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
