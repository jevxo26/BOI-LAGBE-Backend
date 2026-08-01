import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DigitalContent } from './digital-content.entity';

@Entity('digital_reading_histories')
export class DigitalReadingHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contentId: string;

  @ManyToOne(() => DigitalContent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  content: DigitalContent;

  @Column()
  userId: string;

  @Column({ type: 'double precision', default: 0 })
  progressPercent: number;

  @Column({ type: 'int', nullable: true })
  lastPosition?: number;

  @Column({ type: 'timestamp' })
  lastReadAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
