import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agent, AgentStatus } from './agent.entity';

@Entity('agent_employees')
export class AgentEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  designation?: string;

  @Column({ type: 'double precision', default: 0 })
  salary: number;

  @Column({ type: 'date', nullable: true })
  joiningDate?: Date;

  @Column({ type: 'enum', enum: AgentStatus, default: AgentStatus.ACTIVE })
  status: AgentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
