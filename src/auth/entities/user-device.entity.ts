import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum DeviceType {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  WEB = 'WEB',
  WINDOWS = 'WINDOWS',
  MAC = 'MAC',
}

@Entity('user_devices')
export class UserDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  deviceId: string;

  @Column({ nullable: true })
  deviceName?: string;

  @Column({ type: 'enum', enum: DeviceType, default: DeviceType.WEB })
  deviceType: DeviceType;

  @Column({ nullable: true })
  operatingSystem?: string;

  @Column({ nullable: true })
  osVersion?: string;

  @Column({ nullable: true })
  browser?: string;

  @Column({ nullable: true })
  appVersion?: string;

  @Column({ nullable: true })
  pushToken?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
