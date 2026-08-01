import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('book_price_histories')
export class BookPriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookId: string;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ type: 'double precision' })
  price: number;

  @Column({ type: 'double precision', nullable: true })
  oldPrice?: number;

  @Column({ nullable: true })
  changedBy?: string;

  @Column({ type: 'timestamp' })
  changedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
