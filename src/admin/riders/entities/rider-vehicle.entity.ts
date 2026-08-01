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

export enum VehicleType {
  BIKE = 'BIKE',
  CYCLE = 'CYCLE',
  CAR = 'CAR',
  OTHER = 'OTHER',
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('rider_vehicles')
export class RiderVehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column({ type: 'enum', enum: VehicleType, default: VehicleType.BIKE })
  vehicleType: VehicleType;

  @Column({ nullable: true })
  vehicleName?: string;

  @Column({ nullable: true })
  registrationNumber?: string;

  @Column({ nullable: true })
  engineNumber?: string;

  @Column({ nullable: true })
  chassisNumber?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.ACTIVE })
  status: VehicleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
