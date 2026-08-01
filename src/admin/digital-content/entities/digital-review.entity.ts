import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DigitalContent } from './digital-content.entity';

export enum DigitalReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('digital_reviews')
export class DigitalReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contentId: string;

  @ManyToOne(() => DigitalContent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  content: DigitalContent;

  @Column()
  userId: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @Column({
    type: 'enum',
    enum: DigitalReviewStatus,
    default: DigitalReviewStatus.PENDING,
  })
  status: DigitalReviewStatus;

  @Column({ nullable: true })
  moderatedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  moderatedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
