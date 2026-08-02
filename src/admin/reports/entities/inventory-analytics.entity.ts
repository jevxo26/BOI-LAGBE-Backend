import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated warehouse/inventory metrics per period — populated by BI jobs.
@Entity('inventory_analytics')
export class InventoryAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalProducts: number;

  @Column({ type: 'int', default: 0 })
  lowStockCount: number;

  @Column({ type: 'int', default: 0 })
  outOfStockCount: number;

  @Column({ type: 'double precision', default: 0 })
  stockValue: number;

  @Column({ type: 'int', default: 0 })
  stockMovementCount: number;

  @Column({ type: 'int', default: 0 })
  damagedStockCount: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
