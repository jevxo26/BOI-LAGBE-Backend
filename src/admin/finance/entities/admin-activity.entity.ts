import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Lightweight record of a finance administration action, distinct from the
// RBAC AuditLog/ActivityLog (which capture full before/after values).
@Entity('admin_activities')
export class AdminActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adminId: string;

  @Column()
  module: string;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  device?: string;

  @Column({ nullable: true })
  browser?: string;

  @CreateDateColumn()
  createdAt: Date;
}
