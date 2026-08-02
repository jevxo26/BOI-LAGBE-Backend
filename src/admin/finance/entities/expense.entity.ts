import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExpenseCategory } from './expense-category.entity';

export enum ExpenseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  expenseCode: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => ExpenseCategory, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: ExpenseCategory;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'date' })
  expenseDate: string;

  @Column({ nullable: true })
  paymentMethodId?: string;

  @Column({ nullable: true })
  paidBy?: string;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'text', nullable: true })
  receiptUrl?: string;

  @Column({
    type: 'enum',
    enum: ExpenseStatus,
    default: ExpenseStatus.PENDING,
  })
  status: ExpenseStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
