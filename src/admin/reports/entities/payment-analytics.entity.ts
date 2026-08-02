import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated payment metrics per period — populated by BI jobs.
@Entity('payment_analytics')
export class PaymentAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalTransactions: number;

  @Column({ type: 'double precision', default: 0 })
  totalAmount: number;

  @Column({ type: 'double precision', default: 0 })
  completedAmount: number;

  @Column({ type: 'double precision', default: 0 })
  failedAmount: number;

  @Column({ type: 'double precision', default: 0 })
  refundedAmount: number;

  @Column({ type: 'double precision', default: 0 })
  avgTransaction: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
