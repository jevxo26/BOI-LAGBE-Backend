import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DigitalCategory } from './digital-category.entity';
import { DigitalSubCategory } from './digital-sub-category.entity';
import { DigitalAuthor } from './digital-author.entity';
import { DigitalPublisher } from './digital-publisher.entity';
import { DigitalCourse } from './digital-course.entity';
import { DigitalDepartment } from './digital-department.entity';
import { DigitalSemester } from './digital-semester.entity';
import { DigitalInstitute } from './digital-institute.entity';

export enum DigitalContentType {
  PREMIUM = 'PREMIUM',
  FREE = 'FREE',
}

export enum DigitalContentStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

@Entity('digital_contents')
export class DigitalContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  contentCode: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'enum', enum: DigitalContentType })
  type: DigitalContentType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  shortDescription?: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ nullable: true })
  categoryId?: string;

  @ManyToOne(() => DigitalCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category?: DigitalCategory;

  @Column({ nullable: true })
  subcategoryId?: string;

  @ManyToOne(() => DigitalSubCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subcategoryId' })
  subcategory?: DigitalSubCategory;

  @Column({ nullable: true })
  authorId?: string;

  @ManyToOne(() => DigitalAuthor, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'authorId' })
  author?: DigitalAuthor;

  @Column({ nullable: true })
  publisherId?: string;

  @ManyToOne(() => DigitalPublisher, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'publisherId' })
  publisher?: DigitalPublisher;

  @Column({ nullable: true })
  courseId?: string;

  @ManyToOne(() => DigitalCourse, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'courseId' })
  course?: DigitalCourse;

  @Column({ nullable: true })
  departmentId?: string;

  @ManyToOne(() => DigitalDepartment, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'departmentId' })
  department?: DigitalDepartment;

  @Column({ nullable: true })
  semesterId?: string;

  @ManyToOne(() => DigitalSemester, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'semesterId' })
  semester?: DigitalSemester;

  @Column({ nullable: true })
  instituteId?: string;

  @ManyToOne(() => DigitalInstitute, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'instituteId' })
  institute?: DigitalInstitute;

  @Column({ type: 'double precision', default: 0 })
  price: number;

  @Column({ type: 'int', nullable: true })
  durationMinutes?: number;

  @Column({
    type: 'enum',
    enum: DigitalContentStatus,
    default: DigitalContentStatus.DRAFT,
  })
  status: DigitalContentStatus;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date | null;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
