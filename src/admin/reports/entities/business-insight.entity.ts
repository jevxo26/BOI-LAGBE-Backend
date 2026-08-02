import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum InsightSeverity {
  INFO = 'INFO',
  POSITIVE = 'POSITIVE',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

// Actionable insight surfaced from analytics (trends, anomalies, alerts).
@Entity('business_insights')
export class BusinessInsight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  insightCode: string;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: InsightSeverity })
  severity: InsightSeverity;

  @Column({ nullable: true })
  metric?: string;

  @Column({ type: 'double precision', nullable: true })
  value?: number | null;

  @Column({ type: 'jsonb', nullable: true })
  context?: Record<string, unknown>;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
