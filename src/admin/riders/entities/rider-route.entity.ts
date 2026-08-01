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

export enum RiderRouteStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('rider_routes')
export class RiderRoute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  startPoint?: string;

  @Column({ nullable: true })
  endPoint?: string;

  @Column({ type: 'double precision', default: 0 })
  distanceKm: number;

  @Column({
    type: 'enum',
    enum: RiderRouteStatus,
    default: RiderRouteStatus.ACTIVE,
  })
  status: RiderRouteStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
