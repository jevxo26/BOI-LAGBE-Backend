import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AnnouncementAudience {
  ALL = 'ALL',
  CUSTOMER = 'CUSTOMER',
  AGENT = 'AGENT',
  RIDER = 'RIDER',
  ADMIN = 'ADMIN',
}

export enum AnnouncementStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// Broadcast announcement targeted at a user segment.
@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: AnnouncementAudience })
  audience: AnnouncementAudience;

  @Column({
    type: 'enum',
    enum: AnnouncementStatus,
    default: AnnouncementStatus.DRAFT,
  })
  status: AnnouncementStatus;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date | null;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
