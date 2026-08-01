import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  module: string;

  @Column()
  activity: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  device?: string;

  @Column({ nullable: true })
  browser?: string;

  @CreateDateColumn()
  createdAt: Date;
}
