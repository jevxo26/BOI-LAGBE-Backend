import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FinancialReportType } from '../../finance/entities';

export enum ExportFormat {
  CSV = 'CSV',
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  JSON = 'JSON',
}

export enum ExportStatus {
  QUEUED = 'QUEUED',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Record of a report export run (download artifact metadata).
@Entity('export_history')
export class ExportHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  exportCode: string;

  @Column({ type: 'enum', enum: FinancialReportType })
  reportType: FinancialReportType;

  @Column({ type: 'enum', enum: ExportFormat })
  format: ExportFormat;

  @Column({ type: 'date', nullable: true })
  periodStart?: string;

  @Column({ type: 'date', nullable: true })
  periodEnd?: string;

  @Column({ type: 'jsonb', nullable: true })
  filters?: Record<string, unknown>;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ type: 'int', nullable: true })
  rowCount?: number | null;

  @Column({
    type: 'enum',
    enum: ExportStatus,
    default: ExportStatus.QUEUED,
  })
  status: ExportStatus;

  @Column({ nullable: true })
  requestedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
