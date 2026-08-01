import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GiftCategory } from './gift-category.entity';

export enum GiftProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('gift_products')
export class GiftProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  categoryId?: string;

  @ManyToOne(() => GiftCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category?: GiftCategory;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'double precision', default: 0 })
  price: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({
    type: 'enum',
    enum: GiftProductStatus,
    default: GiftProductStatus.ACTIVE,
  })
  status: GiftProductStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
