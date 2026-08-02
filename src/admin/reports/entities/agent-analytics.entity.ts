import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated agent network metrics per period — populated by BI jobs.
@Entity('agent_analytics')
export class AgentAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalAgents: number;

  @Column({ type: 'int', default: 0 })
  activeAgents: number;

  @Column({ type: 'int', default: 0 })
  totalOrders: number;

  @Column({ type: 'double precision', default: 0 })
  totalSales: number;

  @Column({ type: 'double precision', default: 0 })
  avgOrderValue: number;

  @Column({ type: 'double precision', default: 0 })
  totalCommission: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
