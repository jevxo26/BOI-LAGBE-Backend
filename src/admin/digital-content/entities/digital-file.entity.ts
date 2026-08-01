import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DigitalContent } from './digital-content.entity';

@Entity('digital_files')
export class DigitalFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contentId: string;

  @ManyToOne(() => DigitalContent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  content: DigitalContent;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  fileType?: string;

  // Postgres bigint reads back as string, so a transformer keeps the typed
  // API numeric (safe for realistic file sizes well below Number.MAX_SAFE_INTEGER).
  @Column({
    type: 'bigint',
    nullable: true,
    transformer: {
      to: (value?: number): string | undefined =>
        value === undefined || value === null ? undefined : value.toString(),
      from: (value?: string | null): number | undefined =>
        value === null || value === undefined ? undefined : Number(value),
    },
  })
  fileSize?: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
