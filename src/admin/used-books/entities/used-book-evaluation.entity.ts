import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookItem, UsedBookCondition } from './used-book-item.entity';

@Entity('used_book_evaluations')
export class UsedBookEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: UsedBookItem;

  @Column()
  evaluatedBy: string;

  @Column({ type: 'enum', enum: UsedBookCondition })
  conditionGrade: UsedBookCondition;

  @Column({ type: 'double precision' })
  estimatedPrice: number;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'timestamp' })
  evaluatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
