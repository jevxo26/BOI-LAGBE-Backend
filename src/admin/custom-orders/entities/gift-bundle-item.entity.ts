import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GiftBundle } from './gift-bundle.entity';
import { GiftProduct } from './gift-product.entity';

@Entity('gift_bundle_items')
export class GiftBundleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bundleId: string;

  @ManyToOne(() => GiftBundle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bundleId' })
  bundle: GiftBundle;

  @Column()
  giftProductId: string;

  @ManyToOne(() => GiftProduct, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'giftProductId' })
  giftProduct: GiftProduct;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
