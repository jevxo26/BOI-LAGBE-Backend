import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentStore } from '../../agents/entities';

export enum AgentLowStockAlertStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
}

@Entity('agent_low_stock_alerts')
export class AgentLowStockAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => AgentStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: AgentStore;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  currentStock: number;

  @Column({ type: 'int' })
  reorderLevel: number;

  @Column({ type: 'timestamp' })
  alertedAt: Date;

  @Column({
    type: 'enum',
    enum: AgentLowStockAlertStatus,
    default: AgentLowStockAlertStatus.OPEN,
  })
  status: AgentLowStockAlertStatus;

  @CreateDateColumn()
  createdAt: Date;
}
