import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentStore } from '../../agents/entities';

export enum AgentProductReceiveStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
}

@Entity('agent_product_receives')
export class AgentProductReceive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => AgentStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: AgentStore;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ nullable: true })
  receivedFrom?: string;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ nullable: true })
  receivedBy?: string;

  @Column({ type: 'timestamp' })
  receivedAt: Date;

  @Column({
    type: 'enum',
    enum: AgentProductReceiveStatus,
    default: AgentProductReceiveStatus.PENDING,
  })
  status: AgentProductReceiveStatus;

  @CreateDateColumn()
  createdAt: Date;
}
