import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomOrder } from './custom-order.entity';

// Human-readable timeline of every admin action on a custom order, also
// exposed as the module's audit trail.
@Entity('custom_order_histories')
export class CustomOrderHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => CustomOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: CustomOrder;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  performedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
