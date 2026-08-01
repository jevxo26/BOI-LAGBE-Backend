import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentStore } from '../../agents/entities';

export enum AgentInventoryAdjustmentType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

@Entity('agent_inventory_adjustments')
export class AgentInventoryAdjustment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => AgentStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: AgentStore;

  @Column()
  productId: string;

  @Column({ type: 'enum', enum: AgentInventoryAdjustmentType })
  adjustmentType: AgentInventoryAdjustmentType;

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
