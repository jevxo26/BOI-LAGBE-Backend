import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Aggregated digital-content metrics per period (views, downloads, purchases,
// avg rating, completion rate, etc.) — populated by reporting/BI jobs.
@Entity('digital_analytics')
export class DigitalAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  contentId?: string;

  @Column()
  period: string;

  @Column()
  metric: string;

  @Column({ type: 'double precision' })
  value: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
