import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rider } from './rider.entity';

@Entity('rider_tracking')
export class RiderTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column({ type: 'double precision', default: 0 })
  latitude: number;

  @Column({ type: 'double precision', default: 0 })
  longitude: number;

  @Column({ type: 'double precision', default: 0 })
  speed: number;

  @Column({ type: 'double precision', default: 0 })
  heading: number;

  @Column({ type: 'timestamp', nullable: true })
  recordedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
