import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FAQStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

// Frequently asked question entry.
@Entity('faqs')
export class FAQ {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'enum', enum: FAQStatus, default: FAQStatus.PUBLISHED })
  status: FAQStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
