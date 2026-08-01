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

@Entity('rider_performances')
export class RiderPerformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int', default: 0 })
  totalDeliveries: number;

  @Column({ type: 'int', default: 0 })
  completedDeliveries: number;

  @Column({ type: 'int', default: 0 })
  failedDeliveries: number;

  @Column({ type: 'double precision', default: 0 })
  onTimeRate: number;

  @Column({ type: 'double precision', default: 0 })
  customerRating: number;

  @Column({ type: 'double precision', default: 0 })
  performanceScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
