import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EmailQueueStatus {
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
}

// Outbound email record (no SMTP integration — administrative queue only).
@Entity('email_queue')
export class EmailQueue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string;

  @Column({ nullable: true })
  cc?: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ nullable: true })
  templateId?: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: EmailQueueStatus,
    default: EmailQueueStatus.QUEUED,
  })
  status: EmailQueueStatus;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
