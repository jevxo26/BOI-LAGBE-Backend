import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PrintJob } from './print-job.entity';

@Entity('print_files')
export class PrintFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  jobId: string;

  @ManyToOne(() => PrintJob, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: PrintJob;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  fileType?: string;

  // Postgres bigint reads back as string, so a transformer keeps the typed
  // API numeric (safe for realistic file sizes well below Number.MAX_SAFE_INTEGER).
  @Column({
    type: 'bigint',
    nullable: true,
    transformer: {
      to: (value?: number): string | undefined =>
        value === undefined || value === null ? undefined : value.toString(),
      from: (value?: string | null): number | undefined =>
        value === null || value === undefined ? undefined : Number(value),
    },
  })
  fileSize?: number;

  @CreateDateColumn()
  createdAt: Date;
}
