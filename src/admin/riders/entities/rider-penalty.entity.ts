import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rider } from './rider.entity';

@Entity('rider_penalties')
export class RiderPenalty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column()
  title: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ nullable: true })
  approvedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
