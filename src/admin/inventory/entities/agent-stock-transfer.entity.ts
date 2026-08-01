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
import { AgentStore } from '../../agents/entities';
import { AgentStockTransferItem } from './agent-stock-transfer-item.entity';

export enum AgentStockTransferStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity('agent_stock_transfers')
export class AgentStockTransfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transferCode: string;

  @Column()
  fromStoreId: string;

  @ManyToOne(() => AgentStore, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'fromStoreId' })
  fromStore: AgentStore;

  @Column()
  toStoreId: string;

  @ManyToOne(() => AgentStore, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'toStoreId' })
  toStore: AgentStore;

  @Column({ nullable: true })
  requestedBy?: string;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  transferDate?: Date;

  @Column({
    type: 'enum',
    enum: AgentStockTransferStatus,
    default: AgentStockTransferStatus.PENDING,
  })
  status: AgentStockTransferStatus;

  @OneToMany(() => AgentStockTransferItem, (item) => item.transfer, {
    cascade: true,
  })
  items: AgentStockTransferItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
