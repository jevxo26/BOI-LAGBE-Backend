import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated user engagement metrics per period — populated by BI jobs.
@Entity('user_activity_analytics')
export class UserActivityAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalActiveUsers: number;

  @Column({ type: 'int', default: 0 })
  totalSessions: number;

  @Column({ type: 'int', default: 0 })
  totalRegistrations: number;

  @Column({ type: 'double precision', default: 0 })
  avgSessionDuration: number;

  @Column({ type: 'double precision', default: 0 })
  retentionRate: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
