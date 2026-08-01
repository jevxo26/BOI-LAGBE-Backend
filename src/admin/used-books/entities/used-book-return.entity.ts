import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookItem } from './used-book-item.entity';

export enum UsedBookReturnStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

// A used-book item sent back to the seller (rejected after inspection, or
// returned post-sale).
@Entity('used_book_returns')
export class UsedBookReturn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: UsedBookItem;

  @Column({ nullable: true })
  requestId?: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({
    type: 'enum',
    enum: UsedBookReturnStatus,
    default: UsedBookReturnStatus.REQUESTED,
  })
  status: UsedBookReturnStatus;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
