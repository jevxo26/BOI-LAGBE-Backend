import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_taxes')
export class OrderTax {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  title: string;

  @Column({ type: 'double precision', default: 0 })
  rate: number;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
