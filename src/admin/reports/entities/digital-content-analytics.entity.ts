import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated digital content metrics per period — populated by BI jobs.
@Entity('digital_content_analytics')
export class DigitalContentAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalContent: number;

  @Column({ type: 'int', default: 0 })
  totalDownloads: number;

  @Column({ type: 'int', default: 0 })
  totalPurchases: number;

  @Column({ type: 'double precision', default: 0 })
  totalRevenue: number;

  @Column({ type: 'int', default: 0 })
  activeSubscriptions: number;

  @Column({ type: 'int', default: 0 })
  totalExamAttempts: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
