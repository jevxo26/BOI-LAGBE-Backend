import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DigitalReportStatus {
  GENERATED = 'GENERATED',
  FAILED = 'FAILED',
}

// Generated digital-content report artifact (file URL) — produced by admin
// export/reporting actions.
@Entity('digital_reports')
export class DigitalReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reportCode: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  reportType?: string;

  @Column({ type: 'timestamp', nullable: true })
  periodStart?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  periodEnd?: Date | null;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ nullable: true })
  generatedBy?: string;

  @Column({
    type: 'enum',
    enum: DigitalReportStatus,
    default: DigitalReportStatus.GENERATED,
  })
  status: DigitalReportStatus;

  @CreateDateColumn()
  createdAt: Date;
}
