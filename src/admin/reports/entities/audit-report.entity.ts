import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AuditReportStatus {
  GENERATED = 'GENERATED',
  REVIEWED = 'REVIEWED',
}

// Audit-trail summary report over a period.
@Entity('audit_reports')
export class AuditReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reportCode: string;

  @Column({ type: 'date' })
  periodStart: string;

  @Column({ type: 'date' })
  periodEnd: string;

  @Column({ type: 'int', default: 0 })
  totalAuditLogs: number;

  @Column({ type: 'int', default: 0 })
  totalActivityLogs: number;

  @Column({ type: 'jsonb', nullable: true })
  summary?: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: AuditReportStatus,
    default: AuditReportStatus.GENERATED,
  })
  status: AuditReportStatus;

  @Column({ nullable: true })
  generatedBy?: string;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
