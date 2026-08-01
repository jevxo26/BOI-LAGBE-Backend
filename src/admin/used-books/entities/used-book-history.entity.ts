import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookSellRequest } from './used-book-sell-request.entity';
import { UsedBookItem } from './used-book-item.entity';

// Human-readable timeline of every step in the buyback pipeline, attached to
// a sell request and/or a specific item.
@Entity('used_book_histories')
export class UsedBookHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  requestId?: string;

  @ManyToOne(() => UsedBookSellRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requestId' })
  request?: UsedBookSellRequest;

  @Column({ nullable: true })
  itemId?: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item?: UsedBookItem;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  performedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
