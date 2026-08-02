import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated area/coverage metrics per period — populated by BI jobs.
@Entity('area_analytics')
export class AreaAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalAreas: number;

  @Column({ type: 'int', default: 0 })
  activeAreas: number;

  @Column({ type: 'int', default: 0 })
  totalOrders: number;

  @Column({ type: 'double precision', default: 0 })
  totalSales: number;

  @Column({ nullable: true })
  topAreaCode?: string;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
