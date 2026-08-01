import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agent } from './agent.entity';

export enum CommissionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

@Entity('agent_commissions')
export class AgentCommission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column()
  orderId: string;

  @Column({ type: 'double precision', default: 0 })
  commissionRate: number;

  @Column({ type: 'double precision', default: 0 })
  salesAmount: number;

  @Column({ type: 'double precision', default: 0 })
  commissionAmount: number;

  @Column({
    type: 'enum',
    enum: CommissionStatus,
    default: CommissionStatus.PENDING,
  })
  status: CommissionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
