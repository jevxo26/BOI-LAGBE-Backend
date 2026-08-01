import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookItem } from './used-book-item.entity';
import { UsedBookOffer } from './used-book-offer.entity';

export enum UsedBookApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Internal approval record raised when an admin approves an offer for a
// used-book item, moving it into the pickup pipeline.
@Entity('used_book_approvals')
export class UsedBookApproval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: UsedBookItem;

  @Column({ nullable: true })
  offerId?: string;

  @ManyToOne(() => UsedBookOffer, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'offerId' })
  offer?: UsedBookOffer;

  @Column()
  requestedBy: string;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({
    type: 'enum',
    enum: UsedBookApprovalStatus,
    default: UsedBookApprovalStatus.PENDING,
  })
  status: UsedBookApprovalStatus;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
