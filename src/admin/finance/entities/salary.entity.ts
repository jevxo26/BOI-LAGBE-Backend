import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EmployeeType {
  AGENT = 'AGENT',
  RIDER = 'RIDER',
  STAFF = 'STAFF',
}

export enum SalaryPaymentStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

// Per-employee salary record for a given month.
@Entity('salaries')
export class Salary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: EmployeeType })
  employeeType: EmployeeType;

  @Column()
  employeeId: string;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'double precision', default: 0 })
  baseSalary: number;

  @Column({ type: 'double precision', default: 0 })
  bonus: number;

  @Column({ type: 'double precision', default: 0 })
  penalty: number;

  @Column({ type: 'double precision', default: 0 })
  commission: number;

  @Column({ type: 'double precision', default: 0 })
  allowance: number;

  @Column({ type: 'double precision', default: 0 })
  deduction: number;

  @Column({ type: 'double precision', default: 0 })
  netSalary: number;

  @Column({
    type: 'enum',
    enum: SalaryPaymentStatus,
    default: SalaryPaymentStatus.PENDING,
  })
  paymentStatus: SalaryPaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
