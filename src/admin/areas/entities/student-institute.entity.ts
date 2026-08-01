import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../auth/entities';
import { Institute } from './institute.entity';

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  GRADUATED = 'GRADUATED',
  DROPPED = 'DROPPED',
  SUSPENDED = 'SUSPENDED',
}

@Entity('student_institutes')
export class StudentInstitute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column()
  instituteId: string;

  @ManyToOne(() => Institute, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'instituteId' })
  institute: Institute;

  @Column({ nullable: true })
  campusId?: string;

  @Column({ nullable: true })
  departmentId?: string;

  @Column({ nullable: true })
  programId?: string;

  @Column({ nullable: true })
  semesterId?: string;

  @Column({ nullable: true })
  academicSessionId?: string;

  @Column({ nullable: true })
  studentRoll?: string;

  @Column({ nullable: true })
  registrationNumber?: string;

  @Column({ type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE })
  studentStatus: StudentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
