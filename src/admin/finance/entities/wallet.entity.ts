import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WalletType {
  CUSTOMER = 'CUSTOMER',
  AGENT = 'AGENT',
  RIDER = 'RIDER',
  PLATFORM = 'PLATFORM',
}

export enum WalletStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  CLOSED = 'CLOSED',
}

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  walletCode: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ type: 'enum', enum: WalletType })
  walletType: WalletType;

  @Column({ type: 'double precision', default: 0 })
  currentBalance: number;

  @Column({ type: 'double precision', default: 0 })
  totalCredited: number;

  @Column({ type: 'double precision', default: 0 })
  totalDebited: number;

  @Column({ type: 'timestamp', nullable: true })
  lastTransactionAt?: Date | null;

  @Column({
    type: 'enum',
    enum: WalletStatus,
    default: WalletStatus.ACTIVE,
  })
  status: WalletStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
