import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  invoiceCode: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  customerName?: string;

  @Column({ type: 'date', nullable: true })
  invoiceDate?: string;

  @Column({ type: 'date', nullable: true })
  dueDate?: string;

  @Column({ type: 'double precision', default: 0 })
  subtotal: number;

  @Column({ type: 'double precision', default: 0 })
  discount: number;

  @Column({ type: 'double precision', default: 0 })
  tax: number;

  @Column({ type: 'double precision', default: 0 })
  totalAmount: number;

  @Column({ type: 'double precision', default: 0 })
  paidAmount: number;

  @Column({ type: 'double precision', default: 0 })
  dueAmount: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
