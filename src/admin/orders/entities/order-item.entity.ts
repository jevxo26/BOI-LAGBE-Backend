import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ nullable: true })
  productId?: string;

  @Column({ nullable: true })
  bookId?: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'double precision', default: 0 })
  unitPrice: number;

  @Column({ type: 'double precision', default: 0 })
  lineTotal: number;

  @CreateDateColumn()
  createdAt: Date;
}
