import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IncomeCategory } from './income-category.entity';

export enum IncomeStatus {
  PENDING = 'PENDING',
  RECORDED = 'RECORDED',
  REVERSED = 'REVERSED',
}

@Entity('incomes')
export class Income {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  incomeCode: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => IncomeCategory, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: IncomeCategory;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'date' })
  incomeDate: string;

  @Column({ nullable: true })
  paymentMethodId?: string;

  @Column({ nullable: true })
  receivedBy?: string;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({
    type: 'enum',
    enum: IncomeStatus,
    default: IncomeStatus.RECORDED,
  })
  status: IncomeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
