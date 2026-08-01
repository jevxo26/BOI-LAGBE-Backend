import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookItem } from './used-book-item.entity';

export enum UsedBookRepairStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('used_book_repairs')
export class UsedBookRepair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: UsedBookItem;

  @Column({ nullable: true })
  repairType?: string;

  @Column({ type: 'double precision', default: 0 })
  cost: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: UsedBookRepairStatus,
    default: UsedBookRepairStatus.PENDING,
  })
  status: UsedBookRepairStatus;

  @Column({ nullable: true })
  performedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
