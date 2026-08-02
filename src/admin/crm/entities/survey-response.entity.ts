import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerSurvey } from './customer-survey.entity';

// A submitted survey response (answers keyed by question id).
@Entity('survey_responses')
export class SurveyResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  surveyId: string;

  @ManyToOne(() => CustomerSurvey, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'surveyId' })
  survey: CustomerSurvey;

  @Column({ nullable: true })
  customerId?: string;

  @Column({ type: 'jsonb' })
  answers: Record<string, unknown>;

  @Column({ type: 'timestamp' })
  submittedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
