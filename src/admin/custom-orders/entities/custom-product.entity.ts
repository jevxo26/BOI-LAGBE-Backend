import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CustomProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('custom_products')
export class CustomProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'double precision', default: 0 })
  basePrice: number;

  @Column({
    type: 'enum',
    enum: CustomProductStatus,
    default: CustomProductStatus.ACTIVE,
  })
  status: CustomProductStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
