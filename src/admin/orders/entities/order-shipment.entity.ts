import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum OrderShipmentStatus {
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

@Entity('order_shipments')
export class OrderShipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ nullable: true })
  packageId?: string;

  @Column({ nullable: true })
  carrier?: string;

  @Column({ nullable: true })
  trackingNumber?: string;

  @Column({
    type: 'enum',
    enum: OrderShipmentStatus,
    default: OrderShipmentStatus.PREPARING,
  })
  status: OrderShipmentStatus;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
