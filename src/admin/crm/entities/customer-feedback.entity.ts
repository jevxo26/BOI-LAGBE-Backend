import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FeedbackStatus {
  NEW = 'NEW',
  REVIEWED = 'REVIEWED',
  ARCHIVED = 'ARCHIVED',
}

// Customer feedback with a star rating and optional comment.
@Entity('customer_feedback')
export class CustomerFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'enum', enum: FeedbackStatus, default: FeedbackStatus.NEW })
  status: FeedbackStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
