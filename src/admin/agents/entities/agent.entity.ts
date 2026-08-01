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
import { AgentArea } from './agent-area.entity';
import { AgentInstitute } from './agent-institute.entity';

export enum AgentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
}

export enum SalaryType {
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  PER_ORDER = 'PER_ORDER',
  COMMISSION_ONLY = 'COMMISSION_ONLY',
}

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true })
  agentCode: string;

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
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({ type: 'enum', enum: SalaryType, default: SalaryType.MONTHLY })
  salaryType: SalaryType;

  @Column({ type: 'double precision', default: 0 })
  baseSalary: number;

  @Column({ type: 'double precision', default: 0 })
  commissionRate: number;

  @Column({ nullable: true })
  warehouseId?: string;

  @Column({ type: 'enum', enum: AgentStatus, default: AgentStatus.ACTIVE })
  status: AgentStatus;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AgentArea, (agentArea) => agentArea.agent)
  agentAreas: AgentArea[];

  @OneToMany(() => AgentInstitute, (agentInstitute) => agentInstitute.agent)
  agentInstitutes: AgentInstitute[];
}
