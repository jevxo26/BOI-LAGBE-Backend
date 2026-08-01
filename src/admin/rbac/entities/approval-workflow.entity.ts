import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApprovalLevel } from './approval-level.entity';

export enum ApprovalWorkflowStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity('approval_workflows')
export class ApprovalWorkflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  module: string;

  @Column()
  referenceId: string;

  @Column()
  approvalLevelId: string;

  @ManyToOne(() => ApprovalLevel, (level) => level.workflows, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'approvalLevelId' })
  approvalLevel: ApprovalLevel;

  @Column()
  requestedBy: string;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({
    type: 'enum',
    enum: ApprovalWorkflowStatus,
    default: ApprovalWorkflowStatus.PENDING,
  })
  status: ApprovalWorkflowStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
