import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Area } from '../../areas/entities';

export enum WarehouseType {
  CENTRAL = 'CENTRAL',
  REGIONAL = 'REGIONAL',
  LOCAL = 'LOCAL',
}

export enum WarehouseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  warehouseCode: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: WarehouseType,
    default: WarehouseType.CENTRAL,
  })
  warehouseType: WarehouseType;

  @Column({ nullable: true })
  managerId?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  countryId?: string;

  @Column({ nullable: true })
  divisionId?: string;

  @Column({ nullable: true })
  districtId?: string;

  @Column({ nullable: true })
  upazilaId?: string;

  @Column({ nullable: true })
  areaId?: string;

  @ManyToOne(() => Area, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'areaId' })
  area?: Area;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'double precision', nullable: true })
  latitude?: number;

  @Column({ type: 'double precision', nullable: true })
  longitude?: number;

  @Column({
    type: 'enum',
    enum: WarehouseStatus,
    default: WarehouseStatus.ACTIVE,
  })
  status: WarehouseStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
