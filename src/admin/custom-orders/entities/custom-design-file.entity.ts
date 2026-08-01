import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomDesign } from './custom-design.entity';

@Entity('custom_design_files')
export class CustomDesignFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  designId: string;

  @ManyToOne(() => CustomDesign, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'designId' })
  design: CustomDesign;

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
