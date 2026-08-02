import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated customer metrics per period — populated by BI jobs.
@Entity('customer_analytics')
export class CustomerAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalCustomers: number;

  @Column({ type: 'int', default: 0 })
  newCustomers: number;

  @Column({ type: 'int', default: 0 })
  activeCustomers: number;

  @Column({ type: 'int', default: 0 })
  churnedCustomers: number;

  @Column({ type: 'double precision', default: 0 })
  repeatPurchaseRate: number;

  @Column({ type: 'double precision', default: 0 })
  avgOrderPerCustomer: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
