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

export enum ProductPriceType {
  REGULAR = 'REGULAR',
  SALE = 'SALE',
}

export enum ProductPriceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('product_prices')
export class ProductPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  variantId?: string;

  @Column({ nullable: true })
  currency?: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'double precision', nullable: true })
  compareAtAmount?: number;

  @Column({
    type: 'enum',
    enum: ProductPriceType,
    default: ProductPriceType.REGULAR,
  })
  priceType: ProductPriceType;

  @Column({ type: 'timestamp', nullable: true })
  effectiveFrom?: Date;

  @Column({ type: 'timestamp', nullable: true })
  effectiveTo?: Date;

  @Column({
    type: 'enum',
    enum: ProductPriceStatus,
    default: ProductPriceStatus.ACTIVE,
  })
  status: ProductPriceStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
