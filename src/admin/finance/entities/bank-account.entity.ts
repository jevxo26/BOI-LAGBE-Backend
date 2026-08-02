import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BankAccountType {
  CURRENT = 'CURRENT',
  SAVINGS = 'SAVINGS',
  ESCROW = 'ESCROW',
}

export enum BankAccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Internal bank account registry (reference data only — no gateway calls).
@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  accountCode: string;

  @Column()
  bankName: string;

  @Column()
  accountName: string;

  @Column()
  accountNumber: string;

  @Column({ nullable: true })
  branchName?: string;

  @Column({ nullable: true })
  routingNumber?: string;

  @Column({ nullable: true })
  swiftCode?: string;

  @Column({
    type: 'enum',
    enum: BankAccountType,
    default: BankAccountType.CURRENT,
  })
  accountType: BankAccountType;

  @Column({ nullable: true })
  currency?: string;

  @Column({ default: false })
  isDefault: boolean;

  @Column({
    type: 'enum',
    enum: BankAccountStatus,
    default: BankAccountStatus.ACTIVE,
  })
  status: BankAccountStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
