import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity('product_variant_options')
export class ProductVariantOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  variantId: string;

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant;

  @Column({ nullable: true })
  attributeId?: string;

  @Column()
  value: string;

  @CreateDateColumn()
  createdAt: Date;
}
