import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PrintJob } from './print-job.entity';

export enum PrintDeliveryStatus {
  SCHEDULED = 'SCHEDULED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('print_deliveries')
export class PrintDelivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  jobId: string;

  @ManyToOne(() => PrintJob, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: PrintJob;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date | null;

  @Column({
    type: 'enum',
    enum: PrintDeliveryStatus,
    default: PrintDeliveryStatus.SCHEDULED,
  })
  status: PrintDeliveryStatus;

  @CreateDateColumn()
  createdAt: Date;
}
