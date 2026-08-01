import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OrderReportStatus {
  GENERATED = 'GENERATED',
  FAILED = 'FAILED',
}

// Generated order report artifact (file URL) — produced by admin
// export/reporting actions.
@Entity('order_reports')
export class OrderReport {
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
    enum: OrderReportStatus,
    default: OrderReportStatus.GENERATED,
  })
  status: OrderReportStatus;

  @CreateDateColumn()
  createdAt: Date;
}
