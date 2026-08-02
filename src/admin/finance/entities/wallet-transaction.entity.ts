import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

export enum WalletTransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

// Wallet movement ledger. Balances are snapshotted on every row.
@Entity('wallet_transactions')
export class WalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  walletId: string;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @Column({ type: 'enum', enum: WalletTransactionType })
  transactionType: WalletTransactionType;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'double precision', default: 0 })
  balanceBefore: number;

  @Column({ type: 'double precision', default: 0 })
  balanceAfter: number;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ nullable: true })
  performedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
