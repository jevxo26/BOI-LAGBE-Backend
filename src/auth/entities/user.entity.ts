import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { StudentProfile } from './student-profile.entity';
import { UserAddress } from './user-address.entity';
import { UserDevice } from './user-device.entity';
import { UserSession } from './user-session.entity';
import { UserOTP } from './user-otp.entity';
import { UserToken } from './user-token.entity';
import { UserLoginHistory } from './user-login-history.entity';
import { UserSecurity } from './user-security.entity';
import { UserPreference } from './user-preference.entity';
import { UserNotificationSetting } from './user-notification-setting.entity';
import { UserIdentityVerification } from './user-identity-verification.entity';
import { UserAttachment } from './user-attachment.entity';
import { UserActivity } from './user-activity.entity';
import { SupportTicket } from './support-ticket.entity';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userCode: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  fullName: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column('simple-array', { default: 'STUDENT' })
  roles: string[];

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  phoneVerifiedAt?: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // 1:1 Relationships
  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToOne(() => StudentProfile, (sp) => sp.user, { cascade: true })
  studentProfile: StudentProfile;

  @OneToOne(() => UserSecurity, (sec) => sec.user, { cascade: true })
  security: UserSecurity;

  @OneToOne(() => UserPreference, (pref) => pref.user, { cascade: true })
  preference: UserPreference;

  @OneToOne(() => UserNotificationSetting, (uns) => uns.user, { cascade: true })
  notificationSetting: UserNotificationSetting;

  @OneToOne(() => UserIdentityVerification, (uiv) => uiv.user, {
    cascade: true,
  })
  identityVerification: UserIdentityVerification;

  // 1:N Relationships
  @OneToMany(() => UserAddress, (addr) => addr.user)
  addresses: UserAddress[];

  @OneToMany(() => UserDevice, (dev) => dev.user)
  devices: UserDevice[];

  @OneToMany(() => UserSession, (sess) => sess.user)
  sessions: UserSession[];

  @OneToMany(() => UserOTP, (otp) => otp.user)
  otps: UserOTP[];

  @OneToMany(() => UserToken, (tok) => tok.user)
  tokens: UserToken[];

  @OneToMany(() => UserLoginHistory, (lh) => lh.user)
  loginHistories: UserLoginHistory[];

  @OneToMany(() => UserAttachment, (att) => att.user)
  attachments: UserAttachment[];

  @OneToMany(() => UserActivity, (act) => act.user)
  activities: UserActivity[];

  @OneToMany(() => SupportTicket, (st) => st.user)
  supportTickets: SupportTicket[];
}
