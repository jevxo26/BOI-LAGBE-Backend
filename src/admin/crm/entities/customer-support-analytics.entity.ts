import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated support metrics per period — populated by BI jobs.
@Entity('customer_support_analytics')
export class CustomerSupportAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalTickets: number;

  @Column({ type: 'int', default: 0 })
  resolvedTickets: number;

  @Column({ type: 'int', default: 0 })
  openTickets: number;

  @Column({ type: 'double precision', default: 0 })
  avgResponseMinutes: number;

  @Column({ type: 'double precision', default: 0 })
  avgResolutionHours: number;

  @Column({ type: 'double precision', default: 0 })
  csatScore: number;

  @Column({ type: 'int', default: 0 })
  totalChats: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
