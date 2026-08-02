import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated notification delivery metrics per period — populated by BI jobs.
@Entity('notification_analytics')
export class NotificationAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalSent: number;

  @Column({ type: 'int', default: 0 })
  deliveredCount: number;

  @Column({ type: 'int', default: 0 })
  openedCount: number;

  @Column({ type: 'int', default: 0 })
  clickCount: number;

  @Column({ type: 'int', default: 0 })
  optOutCount: number;

  @Column({ type: 'double precision', default: 0 })
  openRate: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
