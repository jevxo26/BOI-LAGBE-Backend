import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ExpenseCategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('expense_categories')
export class ExpenseCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: false })
  isSystem: boolean;

  @Column({
    type: 'enum',
    enum: ExpenseCategoryStatus,
    default: ExpenseCategoryStatus.ACTIVE,
  })
  status: ExpenseCategoryStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
