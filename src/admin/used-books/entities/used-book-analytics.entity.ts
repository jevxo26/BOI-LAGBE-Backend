import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Aggregated used-book metrics per period (requests, offers, conversions,
// avg offer amount, etc.) — populated by reporting/BI jobs.
@Entity('used_book_analytics')
export class UsedBookAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
