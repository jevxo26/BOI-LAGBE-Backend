import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';

export enum CompanyBranchStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('company_branches')
export class CompanyBranch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ unique: true })
  branchCode: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  managerName?: string;

  @Column({
    type: 'enum',
    enum: CompanyBranchStatus,
    default: CompanyBranchStatus.ACTIVE,
  })
  status: CompanyBranchStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
