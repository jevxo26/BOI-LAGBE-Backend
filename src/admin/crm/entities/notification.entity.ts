import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NotificationType {
  ORDER = 'ORDER',
  PROMOTION = 'PROMOTION',
  SYSTEM = 'SYSTEM',
  PAYMENT = 'PAYMENT',
  DELIVERY = 'DELIVERY',
  LOYALTY = 'LOYALTY',
  OTHER = 'OTHER',
}

export enum NotificationChannel {
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IN_APP = 'IN_APP',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

// Outbound notification to a user (in-app/push record).
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    default: NotificationChannel.IN_APP,
  })
  channel: NotificationChannel;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, unknown>;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
