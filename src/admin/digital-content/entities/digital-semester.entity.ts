import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DigitalSemesterStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('digital_semesters')
export class DigitalSemester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int', nullable: true })
  semesterNumber?: number;

  @Column({ nullable: true })
  academicYear?: string;

  @Column({
    type: 'enum',
    enum: DigitalSemesterStatus,
    default: DigitalSemesterStatus.ACTIVE,
  })
  status: DigitalSemesterStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
