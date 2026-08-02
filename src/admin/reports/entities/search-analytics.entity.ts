import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated search behaviour metrics per period — populated by BI jobs.
@Entity('search_analytics')
export class SearchAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalSearches: number;

  @Column({ type: 'int', default: 0 })
  uniqueSearches: number;

  @Column({ type: 'int', default: 0 })
  noResultSearches: number;

  @Column({ nullable: true })
  topSearchTerm?: string;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
