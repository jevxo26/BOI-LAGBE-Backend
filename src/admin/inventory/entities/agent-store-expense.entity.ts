import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentStore } from '../../agents/entities';
import { AgentStoreExpenseCategory } from './agent-store-expense-category.entity';

export enum AgentStoreExpenseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('agent_store_expenses')
export class AgentStoreExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => AgentStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: AgentStore;

  @Column({ nullable: true })
  categoryId?: string;

  @ManyToOne(() => AgentStoreExpenseCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category?: AgentStoreExpenseCategory;

  @Column({ type: 'date' })
  expenseDate: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ nullable: true })
  paidBy?: string;

  @Column({
    type: 'enum',
    enum: AgentStoreExpenseStatus,
    default: AgentStoreExpenseStatus.PENDING,
  })
  status: AgentStoreExpenseStatus;

  @CreateDateColumn()
  createdAt: Date;
}
