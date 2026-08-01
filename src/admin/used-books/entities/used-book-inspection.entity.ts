import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookItem, UsedBookCondition } from './used-book-item.entity';

export enum UsedBookInspectionDecision {
  ACCEPT = 'ACCEPT',
  REPAIR = 'REPAIR',
  REJECT = 'REJECT',
}

@Entity('used_book_inspections')
export class UsedBookInspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: UsedBookItem;

  @Column()
  inspectedBy: string;

  @Column({ type: 'timestamp' })
  inspectionDate: Date;

  @Column({ type: 'enum', enum: UsedBookCondition })
  conditionGrade: UsedBookCondition;

  @Column({ default: false })
  repairNeeded: boolean;

  @Column({ type: 'enum', enum: UsedBookInspectionDecision })
  decision: UsedBookInspectionDecision;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'timestamp' })
  inspectedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
