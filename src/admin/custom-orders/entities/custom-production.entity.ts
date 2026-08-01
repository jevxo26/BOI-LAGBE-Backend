import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomOrder } from './custom-order.entity';

export enum CustomProductionStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('custom_productions')
export class CustomProduction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => CustomOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: CustomOrder;

  @Column()
  startedBy: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  estimatedCompletionDate?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({
    type: 'enum',
    enum: CustomProductionStatus,
    default: CustomProductionStatus.IN_PROGRESS,
  })
  status: CustomProductionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
