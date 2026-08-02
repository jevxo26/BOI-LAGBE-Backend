import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SupplierPaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

// Payment record towards a supplier (linked to purchases).
@Entity('supplier_payments')
export class SupplierPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  paymentCode: string;

  @Column()
  supplierId: string;

  @Column({ nullable: true })
  purchaseId?: string;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'date' })
  paymentDate: string;

  @Column({ nullable: true })
  paymentMethodId?: string;

  @Column({
    type: 'enum',
    enum: SupplierPaymentStatus,
    default: SupplierPaymentStatus.PENDING,
  })
  status: SupplierPaymentStatus;

  @Column({ nullable: true })
  paidBy?: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
