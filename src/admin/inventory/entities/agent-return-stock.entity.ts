import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentStore } from '../../agents/entities';

export enum AgentReturnStockStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('agent_return_stocks')
export class AgentReturnStock {
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
  quantity: number;

  @Column({ nullable: true })
  returnSource?: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({
    type: 'enum',
    enum: AgentReturnStockStatus,
    default: AgentReturnStockStatus.PENDING,
  })
  status: AgentReturnStockStatus;

  @CreateDateColumn()
  createdAt: Date;
}
