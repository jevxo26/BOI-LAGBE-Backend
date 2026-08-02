import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

export enum KpiStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// A tracked key performance indicator with target vs actual.
@Entity('kpis')
export class KPI {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  kpiCode: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'double precision', default: 0 })
  value: number;

  @Column({ type: 'double precision', nullable: true })
  target?: number | null;

  @Column({ nullable: true })
  unit?: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @Column({
    type: 'enum',
    enum: KpiStatus,
    default: KpiStatus.ACTIVE,
  })
  status: KpiStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
