import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity('inventory_batches')
export class InventoryBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inventoryId: string;

  @ManyToOne(() => Inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;

  @Column()
  batchNumber: string;

  @Column({ type: 'date', nullable: true })
  manufacturingDate?: string;

  @Column({ type: 'date', nullable: true })
  expiryDate?: string;

  @Column({ type: 'date', nullable: true })
  receivedDate?: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  remainingQuantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
