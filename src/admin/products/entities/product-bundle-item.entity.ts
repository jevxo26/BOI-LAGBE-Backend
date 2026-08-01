import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductBundle } from './product-bundle.entity';

@Entity('product_bundle_items')
export class ProductBundleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bundleId: string;

  @ManyToOne(() => ProductBundle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bundleId' })
  bundle: ProductBundle;

  @Column()
  productId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
