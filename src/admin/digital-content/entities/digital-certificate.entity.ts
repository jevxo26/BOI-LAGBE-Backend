import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DigitalExam } from './digital-exam.entity';

export enum DigitalCertificateStatus {
  ISSUED = 'ISSUED',
  REVOKED = 'REVOKED',
}

// Certificate awarded to a user after completing an exam / course.
@Entity('digital_certificates')
export class DigitalCertificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  certificateCode: string;

  @Column({ nullable: true })
  examId?: string;

  @ManyToOne(() => DigitalExam, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'examId' })
  exam?: DigitalExam;

  @Column()
  userId: string;

  @Column({ nullable: true })
  issuedBy?: string;

  @Column({ type: 'timestamp' })
  issuedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date | null;

  @Column({
    type: 'enum',
    enum: DigitalCertificateStatus,
    default: DigitalCertificateStatus.ISSUED,
  })
  status: DigitalCertificateStatus;

  @CreateDateColumn()
  createdAt: Date;
}
