import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookSellRequest } from './used-book-sell-request.entity';

export enum UsedBookSettlementStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
}

// Final settlement of the seller payout for a completed sell request.
@Entity('used_book_settlements')
export class UsedBookSettlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requestId: string;

  @ManyToOne(() => UsedBookSellRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requestId' })
  request: UsedBookSellRequest;

  @Column()
  sellerId: string;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({
    type: 'enum',
    enum: UsedBookSettlementStatus,
    default: UsedBookSettlementStatus.PENDING,
  })
  status: UsedBookSettlementStatus;

  @Column({ nullable: true })
  reference?: string;

  @Column({ type: 'timestamp', nullable: true })
  settledAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
