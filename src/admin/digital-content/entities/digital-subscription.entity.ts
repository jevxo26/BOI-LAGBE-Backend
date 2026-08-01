import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DigitalSubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

// Platform subscription that unlocks premium content. No payment gateway
// integration — records only.
@Entity('digital_subscriptions')
export class DigitalSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  plan?: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: DigitalSubscriptionStatus,
    default: DigitalSubscriptionStatus.ACTIVE,
  })
  status: DigitalSubscriptionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
