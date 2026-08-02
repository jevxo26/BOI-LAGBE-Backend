import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Stored support report document with its generated payload.
@Entity('customer_support_reports')
export class CustomerSupportReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reportCode: string;

  @Column()
  title: string;

  @Column({ type: 'date', nullable: true })
  periodStart?: string;

  @Column({ type: 'date', nullable: true })
  periodEnd?: string;

  @Column({ type: 'jsonb', nullable: true })
  reportData?: Record<string, unknown>;

  @Column({ nullable: true })
  generatedBy?: string;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
