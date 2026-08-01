import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rider } from './rider.entity';

export enum AttemptResult {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity('rider_delivery_attempts')
export class RiderDeliveryAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column()
  orderId: string;

  @Column({ type: 'timestamp', nullable: true })
  attemptedAt?: Date;

  @Column({ type: 'int', default: 1 })
  attemptNumber: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'enum', enum: AttemptResult, default: AttemptResult.FAILED })
  result: AttemptResult;

  @CreateDateColumn()
  createdAt: Date;
}
