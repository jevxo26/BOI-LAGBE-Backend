import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomOrder } from './custom-order.entity';

@Entity('custom_order_items')
export class CustomOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => CustomOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: CustomOrder;

  @Column({ nullable: true })
  productId?: string;

  @Column({ nullable: true })
  templateId?: string;

  @Column({ nullable: true })
  designId?: string;

  @Column({ nullable: true })
  specificationId?: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'double precision', default: 0 })
  unitPrice: number;

  @Column({ type: 'double precision', default: 0 })
  lineTotal: number;

  @CreateDateColumn()
  createdAt: Date;
}
