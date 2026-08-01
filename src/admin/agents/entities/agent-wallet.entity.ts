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

@Entity('agent_wallets')
export class AgentWallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column({ type: 'double precision', default: 0 })
  currentBalance: number;

  @Column({ type: 'double precision', default: 0 })
  totalEarned: number;

  @Column({ type: 'double precision', default: 0 })
  totalWithdraw: number;

  @Column({ type: 'timestamp', nullable: true })
  lastUpdated?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
