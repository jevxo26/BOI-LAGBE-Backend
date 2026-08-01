import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomProduct, CustomProductStatus } from './custom-product.entity';

@Entity('custom_product_templates')
export class CustomProductTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => CustomProduct, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: CustomProduct;

  @Column()
  templateCode: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({
    type: 'enum',
    enum: CustomProductStatus,
    default: CustomProductStatus.ACTIVE,
  })
  status: CustomProductStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
