import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SuggestionStatus {
  NEW = 'NEW',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

// Customer-submitted product/process suggestion.
@Entity('customer_suggestions')
export class CustomerSuggestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: SuggestionStatus,
    default: SuggestionStatus.NEW,
  })
  status: SuggestionStatus;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
