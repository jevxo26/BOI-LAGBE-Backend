import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookItem } from './used-book-item.entity';

export enum UsedBookOfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

@Entity('used_book_offers')
export class UsedBookOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: UsedBookItem;

  @Column({ type: 'double precision' })
  offerAmount: number;

  @Column({
    type: 'enum',
    enum: UsedBookOfferStatus,
    default: UsedBookOfferStatus.PENDING,
  })
  status: UsedBookOfferStatus;

  @Column()
  offeredBy: string;

  @Column({ type: 'timestamp' })
  offeredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
