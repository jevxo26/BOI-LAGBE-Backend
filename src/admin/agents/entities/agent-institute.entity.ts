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
import { Institute } from '../../areas/entities';

export enum AgentInstituteStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('agent_institutes')
export class AgentInstitute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentId: string;

  @ManyToOne(() => Agent, (agent) => agent.agentInstitutes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column()
  instituteId: string;

  @ManyToOne(() => Institute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instituteId' })
  institute: Institute;

  @Column({ nullable: true })
  assignedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt?: Date;

  @Column({
    type: 'enum',
    enum: AgentInstituteStatus,
    default: AgentInstituteStatus.ACTIVE,
  })
  status: AgentInstituteStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
