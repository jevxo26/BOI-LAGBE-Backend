import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated used-book buyback/resale metrics per period — BI job output.
// Table named to avoid clashing with the used-books module's UsedBookAnalytics.
@Entity('bi_used_book_analytics')
export class UsedBookAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalRequests: number;

  @Column({ type: 'int', default: 0 })
  approvedItems: number;

  @Column({ type: 'int', default: 0 })
  evaluatedItems: number;

  @Column({ type: 'int', default: 0 })
  resoldItems: number;

  @Column({ type: 'double precision', default: 0 })
  totalValue: number;

  @Column({ type: 'double precision', default: 0 })
  avgBuybackPrice: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
