import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { StockTransferItem } from './stock-transfer-item.entity';

export enum StockTransferStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity('stock_transfers')
export class StockTransfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transferCode: string;

  @Column()
  fromWarehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'fromWarehouseId' })
  fromWarehouse: Warehouse;

  @Column()
  toWarehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'toWarehouseId' })
  toWarehouse: Warehouse;

  @Column({ nullable: true })
  requestedBy?: string;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  transferDate?: Date;

  @Column({
    type: 'enum',
    enum: StockTransferStatus,
    default: StockTransferStatus.PENDING,
  })
  status: StockTransferStatus;

  @OneToMany(() => StockTransferItem, (item) => item.transfer, {
    cascade: true,
  })
  items: StockTransferItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
