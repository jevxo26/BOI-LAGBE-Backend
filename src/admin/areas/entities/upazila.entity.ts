import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { District } from './district.entity';

export enum UpazilaStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('upazilas')
export class Upazila {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  districtId: string;

  @ManyToOne(() => District, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'districtId' })
  district: District;

  @Column()
  name: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ type: 'enum', enum: UpazilaStatus, default: UpazilaStatus.ACTIVE })
  status: UpazilaStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
