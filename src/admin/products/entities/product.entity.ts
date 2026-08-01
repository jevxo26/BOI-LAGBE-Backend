import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { ProductSubCategory } from './product-sub-category.entity';
import { ProductBrand } from './product-brand.entity';

export enum ProductType {
  SIMPLE = 'SIMPLE',
  VARIANT = 'VARIANT',
  BUNDLE = 'BUNDLE',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  productCode: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  categoryId?: string;

  @ManyToOne(() => ProductCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category?: ProductCategory;

  @Column({ nullable: true })
  subcategoryId?: string;

  @ManyToOne(() => ProductSubCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subcategoryId' })
  subcategory?: ProductSubCategory;

  @Column({ nullable: true })
  brandId?: string;

  @ManyToOne(() => ProductBrand, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brandId' })
  brand?: ProductBrand;

  @Column({ type: 'text', nullable: true })
  shortDescription?: string;

  @Column({ type: 'text', nullable: true })
  longDescription?: string;

  @Column({ type: 'enum', enum: ProductType, default: ProductType.SIMPLE })
  type: ProductType;

  @Column({ nullable: true })
  unit?: string;

  @Column({ type: 'double precision', nullable: true })
  weight?: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date | null;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
