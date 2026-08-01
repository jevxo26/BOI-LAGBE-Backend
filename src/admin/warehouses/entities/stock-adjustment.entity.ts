import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';

export enum StockAdjustmentType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

@Entity('stock_adjustments')
export class StockAdjustment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @Column()
  productId: string;

  @Column({ type: 'enum', enum: StockAdjustmentType })
  adjustmentType: StockAdjustmentType;

  @Column({ type: 'int' })
  oldQuantity: number;

  @Column({ type: 'int' })
  newQuantity: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ nullable: true })
  approvedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
