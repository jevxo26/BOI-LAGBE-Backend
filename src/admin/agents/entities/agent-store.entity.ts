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

export enum AgentStoreStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('agent_stores')
export class AgentStore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column()
  storeName: string;

  @Column({ nullable: true })
  storeCode?: string;

  @Column({ nullable: true })
  warehouseId?: string;

  @Column({ nullable: true })
  areaId?: string;

  @ManyToOne(() => Area, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'areaId' })
  area?: Area;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'double precision', nullable: true })
  latitude?: number;

  @Column({ type: 'double precision', nullable: true })
  longitude?: number;

  @Column({ type: 'time', nullable: true })
  openingTime?: string;

  @Column({ type: 'time', nullable: true })
  closingTime?: string;

  @Column({
    type: 'enum',
    enum: AgentStoreStatus,
    default: AgentStoreStatus.ACTIVE,
  })
  status: AgentStoreStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
