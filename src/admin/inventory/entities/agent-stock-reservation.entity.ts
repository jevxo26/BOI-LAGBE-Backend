import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentInventory } from './agent-inventory.entity';

export enum AgentStockReservationStatus {
  ACTIVE = 'ACTIVE',
  RELEASED = 'RELEASED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('agent_stock_reservations')
export class AgentStockReservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inventoryId: string;

  @ManyToOne(() => AgentInventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventoryId' })
  inventory: AgentInventory;

  @Column({ nullable: true })
  orderId?: string;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  reservedQuantity: number;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({
    type: 'enum',
    enum: AgentStockReservationStatus,
    default: AgentStockReservationStatus.ACTIVE,
  })
  status: AgentStockReservationStatus;

  @CreateDateColumn()
  createdAt: Date;
}
