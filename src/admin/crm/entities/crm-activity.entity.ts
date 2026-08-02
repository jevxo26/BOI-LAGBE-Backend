import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Audit trail of admin CRM actions (ticket updates, replies, assignments).
@Entity('crm_activities')
export class CRMActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adminId: string;

  @Column()
  activityType: string;

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

  @CreateDateColumn()
  createdAt: Date;
}
