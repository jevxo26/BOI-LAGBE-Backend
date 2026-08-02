import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentGateway } from './payment-gateway.entity';

export enum PaymentTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentDirection {
  INFLOW = 'INFLOW',
  OUTFLOW = 'OUTFLOW',
}

// Payment transaction record (internal accounting view of money movement).
@Entity('payment_transactions')
export class PaymentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  transactionCode: string;

  @Column({ nullable: true })
  gatewayId?: string;

  @ManyToOne(() => PaymentGateway, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'gatewayId' })
  gateway?: PaymentGateway;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  walletId?: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ default: 'BDT' })
  currency: string;

  @Column({ type: 'enum', enum: PaymentDirection })
  direction: PaymentDirection;

  @Column({
    type: 'enum',
    enum: PaymentTransactionStatus,
    default: PaymentTransactionStatus.PENDING,
  })
  status: PaymentTransactionStatus;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ nullable: true })
  processedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
