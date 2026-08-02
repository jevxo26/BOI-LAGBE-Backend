import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum JournalEntryType {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
  ADJUSTMENT = 'ADJUSTMENT',
  CLOSING = 'CLOSING',
}

export enum JournalEntryStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
}

// Head of a double-entry journal posting; the individual lines live in
// ledgers (one row per account touched).
@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  entryCode: string;

  @Column({ type: 'date' })
  entryDate: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: JournalEntryType,
    default: JournalEntryType.MANUAL,
  })
  entryType: JournalEntryType;

  @Column({ type: 'double precision', default: 0 })
  debitTotal: number;

  @Column({ type: 'double precision', default: 0 })
  creditTotal: number;

  @Column({
    type: 'enum',
    enum: JournalEntryStatus,
    default: JournalEntryStatus.DRAFT,
  })
  status: JournalEntryStatus;

  @Column({ nullable: true })
  postedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  postedAt?: Date | null;

  @Column({ nullable: true })
  reversedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
