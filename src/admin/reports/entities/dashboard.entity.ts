import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DashboardWidget } from './dashboard-widget.entity';

export enum DashboardStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Saved admin dashboard layout holding a set of widgets.
@Entity('dashboards')
export class Dashboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  dashboardCode: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  layout?: Record<string, unknown>;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: false })
  isSystem: boolean;

  @Column({
    type: 'enum',
    enum: DashboardStatus,
    default: DashboardStatus.ACTIVE,
  })
  status: DashboardStatus;

  @Column({ nullable: true })
  createdBy?: string;

  @OneToMany(() => DashboardWidget, (widget) => widget.dashboard)
  widgets: DashboardWidget[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
