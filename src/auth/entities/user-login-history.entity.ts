import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_login_histories')
export class UserLoginHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.loginHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  deviceId?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  browser?: string;

  @Column({ nullable: true })
  operatingSystem?: string;

  @CreateDateColumn()
  loginTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  logoutTime?: Date;

  @Column({ nullable: true })
  location?: string;

  @Column({ default: 'SUCCESS' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
