import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated delivery performance metrics per period — populated by BI jobs.
@Entity('delivery_analytics')
export class DeliveryAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalDeliveries: number;

  @Column({ type: 'int', default: 0 })
  onTimeDeliveries: number;

  @Column({ type: 'int', default: 0 })
  lateDeliveries: number;

  @Column({ type: 'int', default: 0 })
  failedDeliveries: number;

  @Column({ type: 'double precision', default: 0 })
  avgDeliveryHours: number;

  @Column({ type: 'double precision', default: 0 })
  onTimeRate: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
