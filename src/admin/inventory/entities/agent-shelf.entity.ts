import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgentStore } from '../../agents/entities';

export enum AgentShelfStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('agent_shelves')
export class AgentShelf {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => AgentStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: AgentStore;

  @Column()
  name: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({
    type: 'enum',
    enum: AgentShelfStatus,
    default: AgentShelfStatus.ACTIVE,
  })
  status: AgentShelfStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
