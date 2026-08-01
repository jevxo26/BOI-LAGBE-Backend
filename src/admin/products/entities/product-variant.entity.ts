import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

export enum ProductVariantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  sku?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'double precision', default: 0 })
  price: number;

  @Column({ type: 'double precision', nullable: true })
  compareAtPrice?: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({
    type: 'enum',
    enum: ProductVariantStatus,
    default: ProductVariantStatus.ACTIVE,
  })
  status: ProductVariantStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
