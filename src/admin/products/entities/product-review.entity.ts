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

export enum ProductReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('product_reviews')
export class ProductReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  userId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  body?: string;

  @Column({
    type: 'enum',
    enum: ProductReviewStatus,
    default: ProductReviewStatus.PENDING,
  })
  status: ProductReviewStatus;

  @Column({ nullable: true })
  moderatedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  moderatedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
