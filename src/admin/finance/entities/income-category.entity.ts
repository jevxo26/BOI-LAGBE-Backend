import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum IncomeCategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('income_categories')
export class IncomeCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: false })
  isSystem: boolean;

  @Column({
    type: 'enum',
    enum: IncomeCategoryStatus,
    default: IncomeCategoryStatus.ACTIVE,
  })
  status: IncomeCategoryStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
