import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_notification_settings')
export class UserNotificationSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.notificationSetting, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: true })
  pushNotification: boolean;

  @Column({ default: true })
  emailNotification: boolean;

  @Column({ default: true })
  smsNotification: boolean;

  @Column({ default: false })
  marketingNotification: boolean;

  @Column({ default: true })
  orderNotification: boolean;

  @Column({ default: true })
  systemNotification: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
