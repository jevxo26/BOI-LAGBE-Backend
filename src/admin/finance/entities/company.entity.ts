import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CompanyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

// Legal company record backing the platform's financial identity.
@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  companyCode: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  legalName?: string;

  @Column({ nullable: true })
  registrationNumber?: string;

  @Column({ nullable: true })
  taxNumber?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  currency?: string;

  @Column({ nullable: true })
  timezone?: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.ACTIVE,
  })
  status: CompanyStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
