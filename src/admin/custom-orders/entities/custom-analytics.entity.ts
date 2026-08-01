import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Aggregated custom-order metrics per period (orders, quotation conversion,
// avg order value, production throughput, etc.) — populated by BI jobs.
@Entity('custom_analytics')
export class CustomAnalytics {
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
