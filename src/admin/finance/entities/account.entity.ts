import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Chart of accounts — the backbone of double-entry bookkeeping.
@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  accountCode: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: AccountType })
  accountType: AccountType;

  @Column({ nullable: true })
  parentAccountId?: string;

  @Column({ default: 'BDT' })
  currency: string;

  @Column({ type: 'double precision', default: 0 })
  openingBalance: number;

  @Column({ type: 'double precision', default: 0 })
  currentBalance: number;

  @Column({ default: false })
  isSystem: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
