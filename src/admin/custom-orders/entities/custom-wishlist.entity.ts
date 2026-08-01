import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomProduct } from './custom-product.entity';

@Entity('custom_wishlists')
export class CustomWishlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => CustomProduct, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: CustomProduct;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
