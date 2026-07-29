import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum DocumentType {
  NID = 'NID',
  PASSPORT = 'PASSPORT',
  STUDENT_ID = 'STUDENT_ID',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('user_identity_verifications')
export class UserIdentityVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.identityVerification, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  @Column()
  documentNumber: string;

  @Column()
  frontImage: string;

  @Column({ nullable: true })
  backImage?: string;

  @Column({ nullable: true })
  selfieImage?: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus;

  @Column({ nullable: true })
  verifiedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
