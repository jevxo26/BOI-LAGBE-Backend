import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Program } from './program.entity';

export enum SemesterStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('semesters')
export class Semester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  programId: string;

  @ManyToOne(() => Program, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'programId' })
  program: Program;

  @Column()
  name: string;

  @Column({ type: 'int', nullable: true })
  semesterNumber?: number;

  @Column({ nullable: true })
  academicYear?: string;

  @Column({
    type: 'enum',
    enum: SemesterStatus,
    default: SemesterStatus.ACTIVE,
  })
  status: SemesterStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
