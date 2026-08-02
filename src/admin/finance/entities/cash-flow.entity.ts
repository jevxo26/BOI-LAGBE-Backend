import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CashFlowType {
  INFLOW = 'INFLOW',
  OUTFLOW = 'OUTFLOW',
}

// Daily cash-flow entry summarizing money in/out for the period.
@Entity('cash_flows')
export class CashFlow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  entryDate: string;

  @Column({ type: 'enum', enum: CashFlowType })
  flowType: CashFlowType;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'double precision', default: 0 })
  balanceAfter: number;

  @CreateDateColumn()
  createdAt: Date;
}
