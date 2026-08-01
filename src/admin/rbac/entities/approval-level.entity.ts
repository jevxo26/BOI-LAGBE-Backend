import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApprovalWorkflow } from './approval-workflow.entity';

export enum ApprovalLevelStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('approval_levels')
export class ApprovalLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int', default: 0 })
  level: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ApprovalLevelStatus,
    default: ApprovalLevelStatus.ACTIVE,
  })
  status: ApprovalLevelStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ApprovalWorkflow, (workflow) => workflow.approvalLevel)
  workflows: ApprovalWorkflow[];
}
