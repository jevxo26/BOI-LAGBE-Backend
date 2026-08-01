import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShoppingCart } from './shopping-cart.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cartId: string;

  @ManyToOne(() => ShoppingCart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: ShoppingCart;

  @Column({ nullable: true })
  productId?: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'double precision', default: 0 })
  unitPrice: number;

  @Column({ type: 'double precision', default: 0 })
  lineTotal: number;

  @CreateDateColumn()
  createdAt: Date;
}
