import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rider } from './rider.entity';

@Entity('rider_analytics')
export class RiderAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column({ type: 'date', nullable: true })
  date?: Date;

  @Column({ type: 'int', default: 0 })
  totalOrders: number;

  @Column({ type: 'int', default: 0 })
  completedOrders: number;

  @Column({ type: 'double precision', default: 0 })
  totalDistance: number;

  @Column({ type: 'double precision', default: 0 })
  totalEarnings: number;

  @CreateDateColumn()
  createdAt: Date;
}
