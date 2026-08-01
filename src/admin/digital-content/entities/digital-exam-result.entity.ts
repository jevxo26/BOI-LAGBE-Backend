import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DigitalExam } from './digital-exam.entity';

export enum DigitalExamResultStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

@Entity('digital_exam_results')
export class DigitalExamResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  examId: string;

  @ManyToOne(() => DigitalExam, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examId' })
  exam: DigitalExam;

  @Column()
  userId: string;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'int', default: 0 })
  totalMarks: number;

  @Column({
    type: 'enum',
    enum: DigitalExamResultStatus,
    default: DigitalExamResultStatus.FAILED,
  })
  status: DigitalExamResultStatus;

  @Column({ type: 'timestamp' })
  submittedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
