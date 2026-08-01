import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductAttribute } from './product-attribute.entity';

@Entity('product_attribute_values')
export class ProductAttributeValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  attributeId: string;

  @ManyToOne(() => ProductAttribute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attributeId' })
  attribute: ProductAttribute;

  @Column()
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  value: string;

  @CreateDateColumn()
  createdAt: Date;
}
