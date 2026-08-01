import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookItem } from './used-book-item.entity';

// Resale pricing applied to an accepted used-book item before it is listed.
@Entity('used_book_pricings')
export class UsedBookPricing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: UsedBookItem;

  @Column({ type: 'double precision', nullable: true })
  basePrice?: number;

  @Column({ type: 'double precision' })
  sellingPrice: number;

  @Column({ type: 'double precision', default: 0 })
  discount: number;

  @Column({ nullable: true })
  setBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  setAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
