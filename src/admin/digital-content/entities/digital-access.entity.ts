import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DigitalContent } from './digital-content.entity';

export enum DigitalAccessType {
  PURCHASED = 'PURCHASED',
  SUBSCRIPTION = 'SUBSCRIPTION',
  ADMINGRANTED = 'ADMINGRANTED',
  TRIAL = 'TRIAL',
}

export enum DigitalAccessStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

// Records who may consume a piece of digital content. Admins can grant access
// directly (ADMINGRANTED) without a purchase or subscription.
@Entity('digital_accesses')
export class DigitalAccess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contentId: string;

  @ManyToOne(() => DigitalContent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  content: DigitalContent;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: DigitalAccessType })
  accessType: DigitalAccessType;

  @Column({ nullable: true })
  grantedBy?: string;

  @Column({ type: 'timestamp' })
  grantedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date | null;

  @Column({
    type: 'enum',
    enum: DigitalAccessStatus,
    default: DigitalAccessStatus.ACTIVE,
  })
  status: DigitalAccessStatus;

  @CreateDateColumn()
  createdAt: Date;
}
