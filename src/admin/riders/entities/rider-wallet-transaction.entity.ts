import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RiderWallet } from './rider-wallet.entity';
import { WalletTransactionType } from '../../agents/entities';

@Entity('rider_wallet_transactions')
export class RiderWalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  walletId: string;

  @ManyToOne(() => RiderWallet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'walletId' })
  wallet: RiderWallet;

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
