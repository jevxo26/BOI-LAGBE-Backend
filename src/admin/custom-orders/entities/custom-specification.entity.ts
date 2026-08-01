import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomOrder } from './custom-order.entity';

@Entity('custom_specifications')
export class CustomSpecification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => CustomOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: CustomOrder;

  @Column({ nullable: true })
  itemId?: string;

  @Column()
  specificationType: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  value?: string;

  @Column({ nullable: true })
  unit?: string;

  @CreateDateColumn()
  createdAt: Date;
}
