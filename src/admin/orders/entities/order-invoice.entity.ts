import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum OrderInvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Entity('order_invoices')
export class OrderInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ unique: true })
  invoiceCode: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({
    type: 'enum',
    enum: OrderInvoiceStatus,
    default: OrderInvoiceStatus.DRAFT,
  })
  status: OrderInvoiceStatus;

  @Column({ type: 'timestamp', nullable: true })
  issuedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
