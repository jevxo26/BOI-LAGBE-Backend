import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JournalEntry } from './journal-entry.entity';
import { Account } from './account.entity';

export enum LedgerTransactionType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

// One account line of a journal entry.
@Entity('ledgers')
export class Ledger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  journalEntryId: string;

  @ManyToOne(() => JournalEntry, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'journalEntryId' })
  journalEntry: JournalEntry;

  @Column()
  accountId: string;

  @ManyToOne(() => Account, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'enum', enum: LedgerTransactionType })
  transactionType: LedgerTransactionType;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'double precision', default: 0 })
  balanceAfter: number;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;
}
