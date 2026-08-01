import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rider } from './rider.entity';

@Entity('rider_reports')
export class RiderReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column({ nullable: true })
  reportType?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, unknown>;

  @Column({ nullable: true })
  generatedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  generatedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
