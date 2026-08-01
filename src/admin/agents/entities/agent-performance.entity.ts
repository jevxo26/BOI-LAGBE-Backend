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

@Entity('agent_performances')
export class AgentPerformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int', default: 0 })
  totalOrders: number;

  @Column({ type: 'int', default: 0 })
  completedOrders: number;

  @Column({ type: 'int', default: 0 })
  cancelledOrders: number;

  @Column({ type: 'int', default: 0 })
  returnedOrders: number;

  @Column({ type: 'double precision', default: 0 })
  totalSales: number;

  @Column({ type: 'double precision', default: 0 })
  customerRating: number;

  @Column({ type: 'double precision', default: 0 })
  performanceScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
