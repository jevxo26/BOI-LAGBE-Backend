import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookItem, UsedBookCondition } from './used-book-item.entity';

// Detailed physical condition report captured during inspection.
@Entity('used_book_condition_reports')
export class UsedBookConditionReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: UsedBookItem;

  @Column({ unique: true })
  reportNumber: string;

  @Column({ type: 'enum', enum: UsedBookCondition })
  overallGrade: UsedBookCondition;

  @Column({ type: 'text', nullable: true })
  pagesCondition?: string;

  @Column({ type: 'text', nullable: true })
  coverCondition?: string;

  @Column({ type: 'text', nullable: true })
  annotations?: string;

  @Column({ type: 'text', nullable: true })
  missingPages?: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt: Date;
}
