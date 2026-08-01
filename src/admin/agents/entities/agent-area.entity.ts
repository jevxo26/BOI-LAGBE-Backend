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
import { Area } from '../../areas/entities';

export enum AgentAreaStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('agent_areas')
export class AgentArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentId: string;

  @ManyToOne(() => Agent, (agent) => agent.agentAreas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column()
  areaId: string;

  @ManyToOne(() => Area, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'areaId' })
  area: Area;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ nullable: true })
  assignedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt?: Date;

  @Column({
    type: 'enum',
    enum: AgentAreaStatus,
    default: AgentAreaStatus.ACTIVE,
  })
  status: AgentAreaStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
