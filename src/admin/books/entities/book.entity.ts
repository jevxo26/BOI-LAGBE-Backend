import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookAuthor } from './book-author.entity';
import { BookPublisher } from './book-publisher.entity';
import { BookCategory } from './book-category.entity';
import { BookSubject } from './book-subject.entity';
import { BookLanguage } from './book-language.entity';
import { BookSeries } from './book-series.entity';
import { BookEdition } from './book-edition.entity';

export enum BookStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  isbn?: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  subtitle?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  authorId?: string;

  @ManyToOne(() => BookAuthor, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'authorId' })
  author?: BookAuthor;

  @Column({ nullable: true })
  publisherId?: string;

  @ManyToOne(() => BookPublisher, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'publisherId' })
  publisher?: BookPublisher;

  @Column({ nullable: true })
  categoryId?: string;

  @ManyToOne(() => BookCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category?: BookCategory;

  @Column({ nullable: true })
  subjectId?: string;

  @ManyToOne(() => BookSubject, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subjectId' })
  subject?: BookSubject;

  @Column({ nullable: true })
  languageId?: string;

  @ManyToOne(() => BookLanguage, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'languageId' })
  language?: BookLanguage;

  @Column({ nullable: true })
  seriesId?: string;

  @ManyToOne(() => BookSeries, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'seriesId' })
  series?: BookSeries;

  @Column({ nullable: true })
  editionId?: string;

  @ManyToOne(() => BookEdition, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'editionId' })
  edition?: BookEdition;

  @Column({ type: 'int', nullable: true })
  pageCount?: number;

  @Column({ type: 'int', nullable: true })
  publishedYear?: number;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ type: 'double precision', default: 0 })
  price: number;

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.DRAFT,
  })
  status: BookStatus;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date | null;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
