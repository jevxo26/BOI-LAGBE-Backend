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
import { PaymentStatus } from './agent-salary.entity';

@Entity('agent_settlements')
export class AgentSettlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column({ type: 'date', nullable: true })
  periodStart?: Date;

  @Column({ type: 'date', nullable: true })
  periodEnd?: Date;

  @Column({ type: 'double precision', default: 0 })
  grossAmount: number;

  @Column({ type: 'double precision', default: 0 })
  deduction: number;

  @Column({ type: 'double precision', default: 0 })
  netAmount: number;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
