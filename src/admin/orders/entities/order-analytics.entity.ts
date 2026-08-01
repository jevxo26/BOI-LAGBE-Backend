import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Aggregated order metrics per period (volume, revenue, cancellation rate,
// avg order value, etc.) — populated by BI jobs.
@Entity('order_analytics')
export class OrderAnalytics {
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
