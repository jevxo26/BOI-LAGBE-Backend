import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DigitalContent } from './digital-content.entity';

export enum DigitalPurchaseStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Purchase record for premium content. No payment gateway integration —
// records only; the admin grants access via DigitalAccess.
@Entity('digital_purchases')
export class DigitalPurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contentId: string;

  @ManyToOne(() => DigitalContent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  content: DigitalContent;

  @Column()
  userId: string;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({ nullable: true })
  reference?: string;

  @Column({
    type: 'enum',
    enum: DigitalPurchaseStatus,
    default: DigitalPurchaseStatus.PENDING,
  })
  status: DigitalPurchaseStatus;

  @Column({ type: 'timestamp', nullable: true })
  purchasedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
