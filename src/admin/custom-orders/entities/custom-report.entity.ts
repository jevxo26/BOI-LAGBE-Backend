import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CustomReportStatus {
  GENERATED = 'GENERATED',
  FAILED = 'FAILED',
}

// Generated custom-order report artifact (file URL) — produced by admin
// export/reporting actions.
@Entity('custom_reports')
export class CustomReport {
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
    enum: CustomReportStatus,
    default: CustomReportStatus.GENERATED,
  })
  status: CustomReportStatus;

  @CreateDateColumn()
  createdAt: Date;
}
