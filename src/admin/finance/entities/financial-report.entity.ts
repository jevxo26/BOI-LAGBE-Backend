import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum FinancialReportType {
  PROFIT_LOSS = 'PROFIT_LOSS',
  BALANCE_SHEET = 'BALANCE_SHEET',
  CASH_FLOW = 'CASH_FLOW',
  TAX = 'TAX',
  COMMISSION = 'COMMISSION',
  SETTLEMENT = 'SETTLEMENT',
  CUSTOM = 'CUSTOM',
}

// Stored finance report document with its generated payload.
@Entity('financial_reports')
export class FinancialReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reportCode: string;

  @Column({ type: 'enum', enum: FinancialReportType })
  reportType: FinancialReportType;

  @Column()
  title: string;

  @Column({ type: 'date', nullable: true })
  periodStart?: string;

  @Column({ type: 'date', nullable: true })
  periodEnd?: string;

  @Column({ type: 'jsonb', nullable: true })
  reportData?: Record<string, unknown>;

  @Column({ nullable: true })
  generatedBy?: string;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
