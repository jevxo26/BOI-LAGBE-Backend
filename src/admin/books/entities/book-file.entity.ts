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

export enum BookFileType {
  PDF = 'PDF',
  EPUB = 'EPUB',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

export enum BookFileStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('book_files')
export class BookFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookId: string;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ type: 'enum', enum: BookFileType })
  fileType: BookFileType;

  @Column()
  fileUrl: string;

  // Postgres bigint reads back as string, so a transformer keeps the typed
  // API numeric (safe for realistic file sizes well below Number.MAX_SAFE_INTEGER).
  @Column({
    type: 'bigint',
    nullable: true,
    transformer: {
      to: (value?: number): string | undefined =>
        value === undefined || value === null ? undefined : value.toString(),
      from: (value?: string | null): number | undefined =>
        value === null || value === undefined ? undefined : Number(value),
    },
  })
  fileSize?: number;

  @Column({ nullable: true })
  title?: string;

  @Column({
    type: 'enum',
    enum: BookFileStatus,
    default: BookFileStatus.ACTIVE,
  })
  status: BookFileStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
