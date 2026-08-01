import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentWallet } from './agent-wallet.entity';

export enum WalletTransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT',
}

@Entity('agent_wallet_transactions')
export class AgentWalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  walletId: string;

  @ManyToOne(() => AgentWallet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'walletId' })
  wallet: AgentWallet;

  @Column({ type: 'enum', enum: WalletTransactionType })
  transactionType: WalletTransactionType;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'double precision', default: 0 })
  balanceBefore: number;

  @Column({ type: 'double precision', default: 0 })
  balanceAfter: number;

  @CreateDateColumn()
  createdAt: Date;
}
