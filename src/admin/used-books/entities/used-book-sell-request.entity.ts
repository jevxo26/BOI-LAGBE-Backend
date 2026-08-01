import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UsedBookSellRequestStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity('used_book_sell_requests')
export class UsedBookSellRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  requestCode: string;

  // Seller (auth User id) who submitted the sell request
  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: UsedBookSellRequestStatus,
    default: UsedBookSellRequestStatus.PENDING_REVIEW,
  })
  status: UsedBookSellRequestStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date | null;

  @Column({ nullable: true })
  rejectReasonId?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
