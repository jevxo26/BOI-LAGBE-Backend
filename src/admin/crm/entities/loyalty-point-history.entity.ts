import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum LoyaltyPointType {
  EARNED = 'EARNED',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED',
  ADJUSTED = 'ADJUSTED',
}

// Ledger of loyalty point movements for a customer.
@Entity('loyalty_point_history')
export class LoyaltyPointHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column({ type: 'int' })
  points: number;

  @Column({ type: 'enum', enum: LoyaltyPointType })
  pointType: LoyaltyPointType;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'int', default: 0 })
  balanceBefore: number;

  @Column({ type: 'int', default: 0 })
  balanceAfter: number;

  @CreateDateColumn()
  createdAt: Date;
}
