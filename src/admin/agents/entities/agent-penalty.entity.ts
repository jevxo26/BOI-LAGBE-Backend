import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Agent } from './agent.entity';

@Entity('agent_penalties')
export class AgentPenalty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column()
  title: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ nullable: true })
  approvedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
