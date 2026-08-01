import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookItem } from './used-book-item.entity';

@Entity('used_book_images')
export class UsedBookImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: UsedBookItem;

  @Column()
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
