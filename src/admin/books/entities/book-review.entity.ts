import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';

export enum BookReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('book_reviews')
export class BookReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookId: string;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column()
  userId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  body?: string;

  @Column({
    type: 'enum',
    enum: BookReviewStatus,
    default: BookReviewStatus.PENDING,
  })
  status: BookReviewStatus;

  @Column({ nullable: true })
  moderatedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  moderatedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
