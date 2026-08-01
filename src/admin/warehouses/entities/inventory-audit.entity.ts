import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';

export enum InventoryAuditStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Entity('inventory_audits')
export class InventoryAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @Column({ type: 'timestamp' })
  auditDate: Date;

  @Column({ nullable: true })
  auditorId?: string;

  @Column({ type: 'int', default: 0 })
  expectedStock: number;

  @Column({ type: 'int', default: 0 })
  physicalStock: number;

  @Column({ type: 'int', default: 0 })
  difference: number;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({
    type: 'enum',
    enum: InventoryAuditStatus,
    default: InventoryAuditStatus.PENDING,
  })
  status: InventoryAuditStatus;

  @CreateDateColumn()
  createdAt: Date;
}
