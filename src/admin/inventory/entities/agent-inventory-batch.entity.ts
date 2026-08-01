import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentInventory } from './agent-inventory.entity';

@Entity('agent_inventory_batches')
export class AgentInventoryBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inventoryId: string;

  @ManyToOne(() => AgentInventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventoryId' })
  inventory: AgentInventory;

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
