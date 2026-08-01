import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_costs')
export class ProductCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  variantId?: string;

  @Column({ type: 'double precision', default: 0 })
  costAmount: number;

  @Column({ nullable: true })
  currency?: string;

  @Column({ type: 'timestamp', nullable: true })
  effectiveFrom?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
