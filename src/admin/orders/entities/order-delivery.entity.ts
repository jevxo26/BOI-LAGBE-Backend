import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum OrderDeliveryStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

// A delivery run assigned to a rider for an order.
@Entity('order_deliveries')
export class OrderDelivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ nullable: true })
  shipmentId?: string;

  @Column({ nullable: true })
  riderId?: string;

  @Column({
    type: 'enum',
    enum: OrderDeliveryStatus,
    default: OrderDeliveryStatus.PENDING,
  })
  status: OrderDeliveryStatus;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
