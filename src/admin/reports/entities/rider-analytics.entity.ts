import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated rider network metrics per period — populated by BI jobs.
// Table named to avoid clashing with the riders module's RiderAnalytics.
@Entity('bi_rider_analytics')
export class RiderAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalRiders: number;

  @Column({ type: 'int', default: 0 })
  activeRiders: number;

  @Column({ type: 'int', default: 0 })
  totalDeliveries: number;

  @Column({ type: 'double precision', default: 0 })
  onTimeRate: number;

  @Column({ type: 'double precision', default: 0 })
  avgDeliveryTime: number;

  @Column({ type: 'int', default: 0 })
  failedDeliveries: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
