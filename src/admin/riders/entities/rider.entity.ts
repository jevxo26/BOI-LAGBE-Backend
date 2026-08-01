import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../auth/entities';
import { RiderArea } from './rider-area.entity';

export enum RiderStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum RiderEmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
}

export enum RiderSalaryType {
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  PER_DELIVERY = 'PER_DELIVERY',
}

@Entity('riders')
export class Rider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true })
  riderCode: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  nationalId?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'date', nullable: true })
  joiningDate?: Date;

  @Column({
    type: 'enum',
    enum: RiderEmploymentType,
    default: RiderEmploymentType.FULL_TIME,
  })
  employmentType: RiderEmploymentType;

  @Column({
    type: 'enum',
    enum: RiderSalaryType,
    default: RiderSalaryType.PER_DELIVERY,
  })
  salaryType: RiderSalaryType;

  @Column({ type: 'double precision', default: 0 })
  baseSalary: number;

  @Column({ type: 'double precision', default: 0 })
  commissionRate: number;

  @Column({ type: 'enum', enum: RiderStatus, default: RiderStatus.ACTIVE })
  status: RiderStatus;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RiderArea, (riderArea) => riderArea.rider)
  riderAreas: RiderArea[];
}
