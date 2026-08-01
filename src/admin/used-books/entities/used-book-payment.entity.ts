import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookSellRequest } from './used-book-sell-request.entity';

export enum UsedBookPaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

// Payment owed to the seller for an accepted sell request. No payment gateway
// integration — records only.
@Entity('used_book_payments')
export class UsedBookPayment {
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

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true })
  reference?: string;

  @Column({
    type: 'enum',
    enum: UsedBookPaymentStatus,
    default: UsedBookPaymentStatus.PENDING,
  })
  status: UsedBookPaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
