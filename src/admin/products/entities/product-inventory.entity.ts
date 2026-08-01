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

export enum ProductInventoryStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

@Entity('product_inventories')
export class ProductInventory {
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
  warehouseId?: string;

  @Column({ type: 'int', default: 0 })
  availableStock: number;

  @Column({ type: 'int', default: 0 })
  reservedStock: number;

  @Column({ type: 'int', nullable: true })
  lowStockThreshold?: number;

  @Column({
    type: 'enum',
    enum: ProductInventoryStatus,
    default: ProductInventoryStatus.OUT_OF_STOCK,
  })
  status: ProductInventoryStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastStockUpdate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
