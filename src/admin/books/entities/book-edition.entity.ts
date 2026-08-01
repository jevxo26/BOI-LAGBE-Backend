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

export enum BookEditionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('book_editions')
export class BookEdition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookId: string;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ type: 'int', nullable: true })
  editionNumber?: number;

  @Column({ nullable: true })
  editionName?: string;

  @Column({ type: 'int', nullable: true })
  publishedYear?: number;

  @Column({ type: 'int', nullable: true })
  pageCount?: number;

  @Column({ type: 'double precision', default: 0 })
  price: number;

  @Column({
    type: 'enum',
    enum: BookEditionStatus,
    default: BookEditionStatus.ACTIVE,
  })
  status: BookEditionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
