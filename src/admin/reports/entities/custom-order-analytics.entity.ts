import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated custom order (print/gift) metrics per period — BI job output.
@Entity('custom_order_analytics')
export class CustomOrderAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalOrders: number;

  @Column({ type: 'int', default: 0 })
  approvedOrders: number;

  @Column({ type: 'int', default: 0 })
  inProduction: number;

  @Column({ type: 'int', default: 0 })
  deliveredOrders: number;

  @Column({ type: 'double precision', default: 0 })
  totalRevenue: number;

  @Column({ type: 'double precision', default: 0 })
  avgOrderValue: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
