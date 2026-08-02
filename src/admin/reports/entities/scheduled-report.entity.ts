import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReportTemplate } from './report-template.entity';

export enum ScheduledReportStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DISABLED = 'DISABLED',
}

// Cron-driven report schedule that produces GeneratedReport rows.
@Entity('scheduled_reports')
export class ScheduledReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  templateId: string;

  @ManyToOne(() => ReportTemplate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'templateId' })
  template: ReportTemplate;

  @Column()
  scheduleName: string;

  @Column()
  cronExpression: string;

  @Column({ type: 'jsonb', nullable: true })
  recipients?: string[];

  @Column({ type: 'jsonb', nullable: true })
  params?: Record<string, unknown>;

  @Column({ type: 'timestamp', nullable: true })
  lastRunAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  nextRunAt?: Date | null;

  @Column({
    type: 'enum',
    enum: ScheduledReportStatus,
    default: ScheduledReportStatus.ACTIVE,
  })
  status: ScheduledReportStatus;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
