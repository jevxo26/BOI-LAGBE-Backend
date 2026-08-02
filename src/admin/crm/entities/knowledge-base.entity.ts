import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum KnowledgeBaseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// Help-center article.
@Entity('knowledge_base')
export class KnowledgeBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  tags?: string[];

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({
    type: 'enum',
    enum: KnowledgeBaseStatus,
    default: KnowledgeBaseStatus.DRAFT,
  })
  status: KnowledgeBaseStatus;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date | null;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
