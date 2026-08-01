import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('book_previews')
export class BookPreview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookId: string;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ nullable: true })
  previewType?: string;

  @Column()
  previewUrl: string;

  @Column({ type: 'int', nullable: true })
  pageCount?: number;

  @CreateDateColumn()
  createdAt: Date;
}
