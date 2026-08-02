import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TaxType {
  VAT = 'VAT',
  SALES = 'SALES',
  INCOME = 'INCOME',
  WITHHOLDING = 'WITHHOLDING',
  OTHER = 'OTHER',
}

export enum TaxStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('taxes')
export class Tax {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  taxCode: string;

  @Column()
  name: string;

  @Column({ type: 'double precision', default: 0 })
  rate: number;

  @Column({ type: 'enum', enum: TaxType })
  taxType: TaxType;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TaxStatus,
    default: TaxStatus.ACTIVE,
  })
  status: TaxStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
