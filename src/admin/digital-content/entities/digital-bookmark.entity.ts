import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DigitalContent } from './digital-content.entity';

@Entity('digital_bookmarks')
export class DigitalBookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contentId: string;

  @ManyToOne(() => DigitalContent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  content: DigitalContent;

  @Column()
  userId: string;

  @Column({ type: 'int', nullable: true })
  page?: number;

  @Column({ type: 'int', nullable: true })
  positionSeconds?: number;

  @CreateDateColumn()
  createdAt: Date;
}
