import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated revenue metrics per period — populated by BI jobs.
@Entity('revenue_analytics')
export class RevenueAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'double precision', default: 0 })
  grossRevenue: number;

  @Column({ type: 'double precision', default: 0 })
  netRevenue: number;

  @Column({ type: 'double precision', default: 0 })
  costOfGoods: number;

  @Column({ type: 'double precision', default: 0 })
  grossProfit: number;

  @Column({ type: 'double precision', default: 0 })
  operatingExpense: number;

  @Column({ type: 'double precision', default: 0 })
  netProfit: number;

  @Column({ type: 'double precision', default: 0 })
  refundAmount: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
