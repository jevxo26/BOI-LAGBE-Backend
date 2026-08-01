import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum OrderCouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

@Entity('order_coupons')
export class OrderCoupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  code: string;

  @Column({ type: 'enum', enum: OrderCouponType })
  type: OrderCouponType;

  @Column({ type: 'double precision', default: 0 })
  value: number;

  @CreateDateColumn()
  createdAt: Date;
}
