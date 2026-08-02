import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ProfitLossPeriodType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

// Period profit-and-loss snapshot (populated by the accounting rollup job).
@Entity('profit_loss')
export class ProfitLoss {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'double precision', default: 0 })
  totalRevenue: number;

  @Column({ type: 'double precision', default: 0 })
  costOfGoods: number;

  @Column({ type: 'double precision', default: 0 })
  grossProfit: number;

  @Column({ type: 'double precision', default: 0 })
  operatingExpense: number;

  @Column({ type: 'double precision', default: 0 })
  netProfit: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
