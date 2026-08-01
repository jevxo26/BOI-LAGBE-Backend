import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Area } from './area.entity';

export enum InstituteType {
  UNIVERSITY = 'UNIVERSITY',
  COLLEGE = 'COLLEGE',
  SCHOOL = 'SCHOOL',
  OTHER = 'OTHER',
}

export enum InstituteStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('institutes')
export class Institute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  areaId: string;

  @ManyToOne(() => Area, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'areaId' })
  area: Area;

  @Column()
  name: string;

  @Column({ nullable: true })
  shortName?: string;

  @Column({ type: 'enum', enum: InstituteType, nullable: true })
  type?: InstituteType;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'double precision', nullable: true })
  latitude?: number;

  @Column({ type: 'double precision', nullable: true })
  longitude?: number;

  @Column({
    type: 'enum',
    enum: InstituteStatus,
    default: InstituteStatus.ACTIVE,
  })
  status: InstituteStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
