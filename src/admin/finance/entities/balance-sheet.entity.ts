import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from './profit-loss.entity';

// Period balance-sheet snapshot (assets = liabilities + equity).
@Entity('balance_sheets')
export class BalanceSheet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'double precision', default: 0 })
  totalAssets: number;

  @Column({ type: 'double precision', default: 0 })
  totalLiabilities: number;

  @Column({ type: 'double precision', default: 0 })
  totalEquity: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
