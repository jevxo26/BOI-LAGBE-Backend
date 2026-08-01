import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rider } from './rider.entity';
import { PaymentStatus } from '../../agents/entities';

@Entity('rider_settlements')
export class RiderSettlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column({ type: 'date', nullable: true })
  periodStart?: Date;

  @Column({ type: 'date', nullable: true })
  periodEnd?: Date;

  @Column({ type: 'double precision', default: 0 })
  grossAmount: number;

  @Column({ type: 'double precision', default: 0 })
  deduction: number;

  @Column({ type: 'double precision', default: 0 })
  netAmount: number;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
