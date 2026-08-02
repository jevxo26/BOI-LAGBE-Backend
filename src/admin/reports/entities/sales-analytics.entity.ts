import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated sales metrics per period — populated by BI jobs.
@Entity('sales_analytics')
export class SalesAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalOrders: number;

  @Column({ type: 'double precision', default: 0 })
  totalSales: number;

  @Column({ type: 'double precision', default: 0 })
  avgOrderValue: number;

  @Column({ type: 'double precision', default: 0 })
  totalDiscount: number;

  @Column({ type: 'double precision', default: 0 })
  returnedAmount: number;

  @Column({ type: 'double precision', default: 0 })
  cancelledAmount: number;

  @Column({ type: 'double precision', default: 0 })
  netSales: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
