import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ActivityType {
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  CREATE_ORDER = 'CREATE_ORDER',
  BOOK_REQUEST = 'BOOK_REQUEST',
  SELL_BOOK = 'SELL_BOOK',
  DOWNLOAD_PDF = 'DOWNLOAD_PDF',
  CUSTOM_PRODUCT_ORDER = 'CUSTOM_PRODUCT_ORDER',
}

@Entity('user_activities')
export class UserActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: ActivityType })
  activity: ActivityType;

  @Column({ nullable: true })
  referenceType?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ nullable: true })
  device?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt: Date;
}
