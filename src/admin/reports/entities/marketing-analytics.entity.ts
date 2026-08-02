import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated marketing campaign metrics per period — populated by BI jobs.
@Entity('marketing_analytics')
export class MarketingAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  campaigns: number;

  @Column({ type: 'int', default: 0 })
  impressions: number;

  @Column({ type: 'int', default: 0 })
  clicks: number;

  @Column({ type: 'int', default: 0 })
  conversions: number;

  @Column({ type: 'double precision', default: 0 })
  conversionRate: number;

  @Column({ type: 'double precision', default: 0 })
  totalSpend: number;

  @Column({ type: 'double precision', default: 0 })
  roi: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
