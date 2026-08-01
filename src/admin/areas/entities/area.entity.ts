import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Upazila } from './upazila.entity';

export enum AreaStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  upazilaId: string;

  @ManyToOne(() => Upazila, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'upazilaId' })
  upazila: Upazila;

  @Column()
  name: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ type: 'double precision', default: 0 })
  deliveryCharge: number;

  @Column({ type: 'int', nullable: true })
  minimumDeliveryDays?: number;

  @Column({ type: 'int', nullable: true })
  maximumDeliveryDays?: number;

  @Column({ type: 'double precision', nullable: true })
  latitude?: number;

  @Column({ type: 'double precision', nullable: true })
  longitude?: number;

  @Column({ type: 'enum', enum: AreaStatus, default: AreaStatus.ACTIVE })
  status: AreaStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
