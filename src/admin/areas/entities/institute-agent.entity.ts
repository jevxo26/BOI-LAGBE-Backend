import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Institute } from './institute.entity';

export enum InstituteAgentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('institute_agents')
export class InstituteAgent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  instituteId: string;

  @ManyToOne(() => Institute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instituteId' })
  institute: Institute;

  @Column()
  agentId: string;

  @Column({ nullable: true })
  assignedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt?: Date;

  @Column({
    type: 'enum',
    enum: InstituteAgentStatus,
    default: InstituteAgentStatus.ACTIVE,
  })
  status: InstituteAgentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
