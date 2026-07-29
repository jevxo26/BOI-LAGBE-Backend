import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.studentProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  studentId?: string;

  @Column({ nullable: true })
  instituteId?: string;

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
  batch?: string;

  @Column({ nullable: true })
  section?: string;

  @Column({ nullable: true })
  rollNumber?: string;

  @Column({ nullable: true })
  registrationNumber?: string;

  @Column({ nullable: true })
  studentType?: string;

  @Column({ type: 'int', nullable: true })
  graduationYear?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
