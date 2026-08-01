import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Institute } from './institute.entity';

@Entity('institute_documents')
export class InstituteDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  instituteId: string;

  @ManyToOne(() => Institute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instituteId' })
  institute: Institute;

  @Column()
  documentName: string;

  @Column({ nullable: true })
  documentType?: string;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ nullable: true })
  uploadedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
