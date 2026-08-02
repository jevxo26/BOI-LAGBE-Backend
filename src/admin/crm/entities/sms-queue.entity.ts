import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SMSQueueStatus {
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

// Outbound SMS record (no SMS gateway integration — administrative queue only).
@Entity('sms_queue')
export class SMSQueue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phone: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  templateId?: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: SMSQueueStatus,
    default: SMSQueueStatus.QUEUED,
  })
  status: SMSQueueStatus;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
