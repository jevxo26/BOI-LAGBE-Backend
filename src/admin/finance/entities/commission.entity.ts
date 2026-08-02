import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CommissionType {
  SALES = 'SALES',
  ORDER = 'ORDER',
  DELIVERY = 'DELIVERY',
  REFERRAL = 'REFERRAL',
  OTHER = 'OTHER',
}

export enum CommissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

// Commission owed to an agent/rider for a completed transaction.
@Entity('commissions')
export class Commission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  commissionCode: string;

  @Column({ nullable: true })
  agentId?: string;

  @Column({ nullable: true })
  riderId?: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ type: 'enum', enum: CommissionType })
  commissionType: CommissionType;

  @Column({ type: 'double precision', default: 0 })
  commissionRate: number;

  @Column({ type: 'double precision', default: 0 })
  salesAmount: number;

  @Column({ type: 'double precision', default: 0 })
  commissionAmount: number;

  @Column({
    type: 'enum',
    enum: CommissionStatus,
    default: CommissionStatus.PENDING,
  })
  status: CommissionStatus;

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
