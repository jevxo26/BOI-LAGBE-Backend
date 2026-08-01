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

@Entity('inventories')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @Column()
  productId: string;

  @Column({ nullable: true })
  batchId?: string;

  @Column({ type: 'int', default: 0 })
  availableStock: number;

  @Column({ type: 'int', default: 0 })
  reservedStock: number;

  @Column({ type: 'int', default: 0 })
  damagedStock: number;

  @Column({ type: 'int', default: 0 })
  returnedStock: number;

  @Column({ type: 'int', default: 0 })
  minimumStock: number;

  @Column({ type: 'int', nullable: true })
  maximumStock?: number;

  @Column({ type: 'int', default: 0 })
  reorderLevel: number;

  @Column({ type: 'double precision', default: 0 })
  unitCost: number;

  @Column({ type: 'double precision', default: 0 })
  sellingPrice: number;

  @Column({ type: 'timestamp', nullable: true })
  lastStockUpdate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
