import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentStore } from '../../agents/entities';

export enum AgentStoreClosingStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity('agent_store_closings')
export class AgentStoreClosing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => AgentStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: AgentStore;

  @Column({ type: 'timestamp' })
  closingDate: Date;

  @Column({ nullable: true })
  openedBy?: string;

  @Column({ nullable: true })
  closedBy?: string;

  @Column({ type: 'double precision', default: 0 })
  openingAmount: number;

  @Column({ type: 'double precision', default: 0 })
  closingAmount: number;

  @Column({ type: 'double precision', default: 0 })
  cashSales: number;

  @Column({ type: 'double precision', default: 0 })
  digitalSales: number;

  @Column({ type: 'double precision', default: 0 })
  expenses: number;

  @Column({ type: 'double precision', default: 0 })
  discrepancy: number;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({
    type: 'enum',
    enum: AgentStoreClosingStatus,
    default: AgentStoreClosingStatus.OPEN,
  })
  status: AgentStoreClosingStatus;

  @CreateDateColumn()
  createdAt: Date;
}
