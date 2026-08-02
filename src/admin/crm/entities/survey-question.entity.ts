import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerSurvey } from './customer-survey.entity';

export enum SurveyQuestionType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  RATING = 'RATING',
  BOOLEAN = 'BOOLEAN',
}

// One question inside a survey.
@Entity('survey_questions')
export class SurveyQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  surveyId: string;

  @ManyToOne(() => CustomerSurvey, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'surveyId' })
  survey: CustomerSurvey;

  @Column()
  question: string;

  @Column({ type: 'enum', enum: SurveyQuestionType })
  questionType: SurveyQuestionType;

  @Column({ type: 'jsonb', nullable: true })
  options?: string[];

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: false })
  isRequired: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
