import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrintService } from './print-service.entity';

export enum PrintJobStatus {
  PENDING = 'PENDING',
  IN_PRODUCTION = 'IN_PRODUCTION',
  COMPLETED = 'COMPLETED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('print_jobs')
export class PrintJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  jobCode: string;

  @Column({ nullable: true })
  serviceId?: string;

  @ManyToOne(() => PrintService, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'serviceId' })
  service?: PrintService;

  @Column({ nullable: true })
  orderId?: string;

  @Column()
  userId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'double precision', default: 0 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ nullable: true })
  startedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date | null;

  @Column({
    type: 'enum',
    enum: PrintJobStatus,
    default: PrintJobStatus.PENDING,
  })
  status: PrintJobStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
