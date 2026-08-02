import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PayrollStatus {
  DRAFT = 'DRAFT',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

// Monthly payroll run summary aggregating the individual salaries.
@Entity('payrolls')
export class Payroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  payrollCode: string;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int', default: 0 })
  totalEmployees: number;

  @Column({ type: 'double precision', default: 0 })
  totalSalary: number;

  @Column({ type: 'double precision', default: 0 })
  totalBonus: number;

  @Column({ type: 'double precision', default: 0 })
  totalPenalty: number;

  @Column({ type: 'double precision', default: 0 })
  totalDeduction: number;

  @Column({ type: 'double precision', default: 0 })
  netPayable: number;

  @Column({
    type: 'enum',
    enum: PayrollStatus,
    default: PayrollStatus.DRAFT,
  })
  status: PayrollStatus;

  @Column({ nullable: true })
  processedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
