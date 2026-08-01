import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomOrder } from './custom-order.entity';

export enum CustomQuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

@Entity('custom_quotations')
export class CustomQuotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => CustomOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: CustomOrder;

  @Column({ unique: true })
  quotationCode: string;

  @Column({ type: 'double precision', default: 0 })
  subtotal: number;

  @Column({ type: 'double precision', default: 0 })
  discount: number;

  @Column({ type: 'double precision', default: 0 })
  tax: number;

  @Column({ type: 'double precision', default: 0 })
  shippingCost: number;

  @Column({ type: 'double precision', default: 0 })
  totalAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  validUntil?: Date | null;

  @Column({
    type: 'enum',
    enum: CustomQuotationStatus,
    default: CustomQuotationStatus.DRAFT,
  })
  status: CustomQuotationStatus;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
