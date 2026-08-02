import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FinancialReportType } from '../../finance/entities';

export enum ReportTemplateStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Reusable report configuration from which GeneratedReport rows are created.
@Entity('report_templates')
export class ReportTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  templateCode: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: FinancialReportType })
  reportType: FinancialReportType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  config?: Record<string, unknown>;

  @Column({ default: false })
  isSystem: boolean;

  @Column({
    type: 'enum',
    enum: ReportTemplateStatus,
    default: ReportTemplateStatus.ACTIVE,
  })
  status: ReportTemplateStatus;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
