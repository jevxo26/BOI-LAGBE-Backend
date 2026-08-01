import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { WarehouseZone } from './warehouse-zone.entity';

export enum WarehouseShelfStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('warehouse_shelves')
export class WarehouseShelf {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @Column({ nullable: true })
  zoneId?: string;

  @ManyToOne(() => WarehouseZone, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'zoneId' })
  zone?: WarehouseZone;

  @Column()
  shelfCode: string;

  @Column({ nullable: true })
  rack?: string;

  @Column({ nullable: true })
  row?: string;

  @Column({ nullable: true })
  column?: string;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({
    type: 'enum',
    enum: WarehouseShelfStatus,
    default: WarehouseShelfStatus.ACTIVE,
  })
  status: WarehouseShelfStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
