import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookItem } from './used-book-item.entity';

export enum UsedBookResaleStatus {
  DRAFT = 'DRAFT',
  LISTED = 'LISTED',
  SOLD = 'SOLD',
  REMOVED = 'REMOVED',
}

// A used-book item published onto the resale catalog.
@Entity('used_book_resales')
export class UsedBookResale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: UsedBookItem;

  @Column({ unique: true })
  listingCode: string;

  @Column({
    type: 'enum',
    enum: UsedBookResaleStatus,
    default: UsedBookResaleStatus.DRAFT,
  })
  status: UsedBookResaleStatus;

  @Column()
  listedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  listedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  soldAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
