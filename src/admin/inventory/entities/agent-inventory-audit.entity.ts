import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentStore } from '../../agents/entities';

export enum AgentInventoryAuditStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Entity('agent_inventory_audits')
export class AgentInventoryAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => AgentStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: AgentStore;

  @Column({ type: 'timestamp' })
  auditDate: Date;

  @Column({ nullable: true })
  auditorId?: string;

  @Column({ type: 'int', default: 0 })
  expectedStock: number;

  @Column({ type: 'int', default: 0 })
  physicalStock: number;

  @Column({ type: 'int', default: 0 })
  difference: number;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({
    type: 'enum',
    enum: AgentInventoryAuditStatus,
    default: AgentInventoryAuditStatus.PENDING,
  })
  status: AgentInventoryAuditStatus;

  @CreateDateColumn()
  createdAt: Date;
}
