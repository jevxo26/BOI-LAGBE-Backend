import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FinancialReportType } from '../../finance/entities';
import { ReportTemplate } from './report-template.entity';

export enum GeneratedReportStatus {
  PENDING = 'PENDING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// One concrete report run produced from a template (or ad hoc).
@Entity('generated_reports')
export class GeneratedReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reportCode: string;

  @Column({ nullable: true })
  templateId?: string;

  @ManyToOne(() => ReportTemplate, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'templateId' })
  template?: ReportTemplate;

  @Column({ type: 'enum', enum: FinancialReportType })
  reportType: FinancialReportType;

  @Column()
  title: string;

  @Column({ type: 'date', nullable: true })
  periodStart?: string;

  @Column({ type: 'date', nullable: true })
  periodEnd?: string;

  @Column({ type: 'jsonb', nullable: true })
  params?: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, unknown>;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({
    type: 'enum',
    enum: GeneratedReportStatus,
    default: GeneratedReportStatus.PENDING,
  })
  status: GeneratedReportStatus;

  @Column({ nullable: true })
  generatedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
