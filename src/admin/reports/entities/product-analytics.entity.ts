import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated product catalog metrics per period — populated by BI jobs.
@Entity('product_analytics')
export class ProductAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ nullable: true })
  productId?: string;

  @Column({ type: 'int', default: 0 })
  totalViews: number;

  @Column({ type: 'int', default: 0 })
  totalSales: number;

  @Column({ type: 'double precision', default: 0 })
  totalRevenue: number;

  @Column({ type: 'double precision', default: 0 })
  avgRating: number;

  @Column({ type: 'int', default: 0 })
  wishlistCount: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
