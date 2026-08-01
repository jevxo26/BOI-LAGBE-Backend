import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsedBookSellRequest } from './used-book-sell-request.entity';

// A single book line inside a sell request; its status drives the entire
// buyback pipeline (evaluation -> offer -> approval -> pickup -> inspection
// -> repair -> publish to resale).
export enum UsedBookItemStatus {
  PENDING_EVALUATION = 'PENDING_EVALUATION',
  OFFERED = 'OFFERED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INSPECTING = 'INSPECTING',
  INSPECTED = 'INSPECTED',
  REPAIRING = 'REPAIRING',
  READY_FOR_RESALE = 'READY_FOR_RESALE',
  PUBLISHED = 'PUBLISHED',
  SOLD = 'SOLD',
  RETURNED = 'RETURNED',
}

export enum UsedBookCondition {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
}

@Entity('used_book_items')
export class UsedBookItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requestId: string;

  @ManyToOne(() => UsedBookSellRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requestId' })
  request: UsedBookSellRequest;

  @Column()
  title: string;

  @Column({ nullable: true })
  author?: string;

  @Column({ nullable: true })
  isbn?: string;

  @Column({ nullable: true })
  edition?: string;

  @Column({ type: 'enum', enum: UsedBookCondition, nullable: true })
  condition?: UsedBookCondition;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'double precision', nullable: true })
  expectedPrice?: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({
    type: 'enum',
    enum: UsedBookItemStatus,
    default: UsedBookItemStatus.PENDING_EVALUATION,
  })
  status: UsedBookItemStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
