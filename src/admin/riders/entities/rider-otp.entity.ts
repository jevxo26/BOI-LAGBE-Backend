import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rider } from './rider.entity';

export enum RiderOtpStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  EXPIRED = 'EXPIRED',
}

@Entity('rider_otps')
export class RiderOTP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column()
  otp: string;

  @Column({ nullable: true })
  purpose?: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  @Column({
    type: 'enum',
    enum: RiderOtpStatus,
    default: RiderOtpStatus.PENDING,
  })
  status: RiderOtpStatus;

  @CreateDateColumn()
  createdAt: Date;
}
