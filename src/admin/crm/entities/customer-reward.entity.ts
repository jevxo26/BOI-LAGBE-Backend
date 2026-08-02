import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CustomerRewardStatus {
  AVAILABLE = 'AVAILABLE',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED',
}

// Reward redeemed by a customer with loyalty points.
@Entity('customer_rewards')
export class CustomerReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  rewardCode: string;

  @Column()
  customerId: string;

  @Column()
  title: string;

  @Column({ type: 'int' })
  pointsCost: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: CustomerRewardStatus,
    default: CustomerRewardStatus.AVAILABLE,
  })
  status: CustomerRewardStatus;

  @Column({ type: 'timestamp', nullable: true })
  redeemedAt?: Date | null;

  @Column({ nullable: true })
  redeemedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
