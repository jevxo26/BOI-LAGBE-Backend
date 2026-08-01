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

export enum RiderAvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
}

@Entity('rider_availabilities')
export class RiderAvailability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'timestamp', nullable: true })
  availableAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  unavailableUntil?: Date;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({
    type: 'enum',
    enum: RiderAvailabilityStatus,
    default: RiderAvailabilityStatus.AVAILABLE,
  })
  status: RiderAvailabilityStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
