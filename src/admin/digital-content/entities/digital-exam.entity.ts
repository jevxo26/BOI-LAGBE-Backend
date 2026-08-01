import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DigitalContent } from './digital-content.entity';

export enum DigitalExamStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

@Entity('digital_exams')
export class DigitalExam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  contentId?: string;

  @ManyToOne(() => DigitalContent, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'contentId' })
  content?: DigitalContent;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', nullable: true })
  durationMinutes?: number;

  @Column({ type: 'int', nullable: true })
  totalMarks?: number;

  @Column({ type: 'int', nullable: true })
  passMarks?: number;

  @Column({
    type: 'enum',
    enum: DigitalExamStatus,
    default: DigitalExamStatus.DRAFT,
  })
  status: DigitalExamStatus;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
