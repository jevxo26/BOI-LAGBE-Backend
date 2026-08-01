import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomProduct } from './custom-product.entity';

export enum CustomReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('custom_reviews')
export class CustomReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  productId?: string;

  @ManyToOne(() => CustomProduct, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'productId' })
  product?: CustomProduct;

  @Column()
  userId: string;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'enum',
    enum: CustomReviewStatus,
    default: CustomReviewStatus.PENDING,
  })
  status: CustomReviewStatus;

  @Column({ nullable: true })
  moderatedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  moderatedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
