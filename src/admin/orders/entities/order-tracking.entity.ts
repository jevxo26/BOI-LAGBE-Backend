import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDelivery } from './order-delivery.entity';

// Tracking events for a delivery run (location + status updates).
@Entity('order_trackings')
export class OrderTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deliveryId: string;

  @ManyToOne(() => OrderDelivery, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deliveryId' })
  delivery: OrderDelivery;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  trackedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
