import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Self-contained audit trail for used-book admin actions (before/after
// values, actor, IP). Mirrors the RBAC AuditLog shape so the used-books
// domain stays reviewable independently.
@Entity('used_book_audits')
export class UsedBookAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  module: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'jsonb', nullable: true })
  oldValue?: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  newValue?: Record<string, unknown>;

  @Column({ nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt: Date;
}
