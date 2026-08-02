import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SurveyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

// Survey/campaign sent to customers.
@Entity('customer_surveys')
export class CustomerSurvey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: SurveyStatus, default: SurveyStatus.DRAFT })
  status: SurveyStatus;

  @Column({ type: 'timestamp', nullable: true })
  startsAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  endsAt?: Date | null;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
