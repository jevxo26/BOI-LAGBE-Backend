import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SettlementEntityType {
  AGENT = 'AGENT',
  RIDER = 'RIDER',
  SUPPLIER = 'SUPPLIER',
}

export enum SettlementPaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

// Periodic settlement run for an agent/rider/supplier (period earnings).
@Entity('financial_settlements')
export class FinancialSettlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  settlementCode: string;

  @Column({ type: 'enum', enum: SettlementEntityType })
  entityType: SettlementEntityType;

  @Column()
  entityId: string;

  @Column({ type: 'date' })
  periodStart: string;

  @Column({ type: 'date' })
  periodEnd: string;

  @Column({ type: 'double precision', default: 0 })
  grossAmount: number;

  @Column({ type: 'double precision', default: 0 })
  deduction: number;

  @Column({ type: 'double precision', default: 0 })
  netAmount: number;

  @Column({
    type: 'enum',
    enum: SettlementPaymentStatus,
    default: SettlementPaymentStatus.PENDING,
  })
  paymentStatus: SettlementPaymentStatus;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
