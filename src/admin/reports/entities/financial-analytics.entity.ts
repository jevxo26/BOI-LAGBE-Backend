import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated finance metrics per period — populated by BI jobs.
@Entity('financial_analytics')
export class FinancialAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'double precision', default: 0 })
  totalIncome: number;

  @Column({ type: 'double precision', default: 0 })
  totalExpense: number;

  @Column({ type: 'double precision', default: 0 })
  netProfit: number;

  @Column({ type: 'double precision', default: 0 })
  totalReceivable: number;

  @Column({ type: 'double precision', default: 0 })
  totalPayable: number;

  @Column({ type: 'double precision', default: 0 })
  cashBalance: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
