import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomOrder } from './custom-order.entity';

export enum CustomDeliveryScheduleStatus {
  SCHEDULED = 'SCHEDULED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('custom_delivery_schedules')
export class CustomDeliverySchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => CustomOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: CustomOrder;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'text' })
  deliveryAddress: string;

  @Column({ nullable: true })
  contactName?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date | null;

  @Column({
    type: 'enum',
    enum: CustomDeliveryScheduleStatus,
    default: CustomDeliveryScheduleStatus.SCHEDULED,
  })
  status: CustomDeliveryScheduleStatus;

  @Column()
  scheduledBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
