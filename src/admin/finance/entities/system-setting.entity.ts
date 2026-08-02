import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SystemSettingGroup {
  GENERAL = 'GENERAL',
  CURRENCY = 'CURRENCY',
  TAX = 'TAX',
  COMMISSION = 'COMMISSION',
  PAYMENT = 'PAYMENT',
  PAYROLL = 'PAYROLL',
  SETTLEMENT = 'SETTLEMENT',
  SECURITY = 'SECURITY',
}

// Key/value configuration for the finance subsystem.
@Entity('system_settings')
export class SystemSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  settingKey: string;

  @Column({ type: 'text' })
  settingValue: string;

  @Column({
    type: 'enum',
    enum: SystemSettingGroup,
    default: SystemSettingGroup.GENERAL,
  })
  group: SystemSettingGroup;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  isSecret: boolean;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
