import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('login_policies')
export class LoginPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  roleId: string;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'int', default: 5 })
  maxLoginAttempts: number;

  @Column({ type: 'int', default: 15 })
  lockDuration: number;

  @Column({ type: 'int', default: 60 })
  sessionTimeout: number;

  @Column({ default: true })
  allowMultipleSession: boolean;

  @Column({ default: false })
  requireTwoFactor: boolean;

  @Column({ type: 'int', default: 90 })
  passwordExpiryDays: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
