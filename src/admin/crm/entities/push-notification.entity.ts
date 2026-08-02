import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PushNotificationStatus {
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

// Outbound push notification record (no push provider integration).
@Entity('push_notifications')
export class PushNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, unknown>;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({
    type: 'enum',
    enum: PushNotificationStatus,
    default: PushNotificationStatus.QUEUED,
  })
  status: PushNotificationStatus;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
