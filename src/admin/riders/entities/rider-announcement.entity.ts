import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rider } from './rider.entity';

@Entity('rider_announcements')
export class RiderAnnouncement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ nullable: true })
  sentBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
