import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Dashboard } from './dashboard.entity';

export enum DashboardWidgetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// A single chart/table/KPI tile inside a dashboard.
@Entity('dashboard_widgets')
export class DashboardWidget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dashboardId: string;

  @ManyToOne(() => Dashboard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dashboardId' })
  dashboard: Dashboard;

  @Column()
  widgetType: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  metricKey?: string;

  @Column({ type: 'jsonb', nullable: true })
  config?: Record<string, unknown>;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({
    type: 'enum',
    enum: DashboardWidgetStatus,
    default: DashboardWidgetStatus.ACTIVE,
  })
  status: DashboardWidgetStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
