import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DigitalExam } from './digital-exam.entity';

@Entity('digital_exam_questions')
export class DigitalExamQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  examId: string;

  @ManyToOne(() => DigitalExam, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examId' })
  exam: DigitalExam;

  @Column({ type: 'text' })
  question: string;

  @Column({ nullable: true })
  optionA?: string;

  @Column({ nullable: true })
  optionB?: string;

  @Column({ nullable: true })
  optionC?: string;

  @Column({ nullable: true })
  optionD?: string;

  @Column({ nullable: true })
  correctAnswer?: string;

  @Column({ type: 'int', default: 1 })
  marks: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
