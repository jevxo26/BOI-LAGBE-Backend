import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentStore } from '../../agents/entities';

export enum AgentStockMovementType {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  RESTOCK = 'RESTOCK',
  RETURN = 'RETURN',
  DAMAGE = 'DAMAGE',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity('agent_stock_movements')
export class AgentStockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => AgentStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: AgentStore;

  @Column()
  productId: string;

  @Column({ type: 'enum', enum: AgentStockMovementType })
  movementType: AgentStockMovementType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ nullable: true })
  performedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
