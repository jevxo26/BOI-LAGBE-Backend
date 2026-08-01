import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Custom-order lifecycle (admin-managed):
//   PENDING_QUOTATION -> QUOTATION_SENT -> QUOTATION_APPROVED
//     -> IN_PRODUCTION -> READY_FOR_DELIVERY -> DELIVERED
//   Rejection / cancellation branches: QUOTATION_SENT -> QUOTATION_REJECTED,
//   any active state -> CANCELLED.
export enum CustomOrderStatus {
  PENDING_QUOTATION = 'PENDING_QUOTATION',
  QUOTATION_SENT = 'QUOTATION_SENT',
  QUOTATION_APPROVED = 'QUOTATION_APPROVED',
  QUOTATION_REJECTED = 'QUOTATION_REJECTED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('custom_orders')
export class CustomOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderCode: string;

  // Customer (auth User id) who placed the custom order
  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: CustomOrderStatus,
    default: CustomOrderStatus.PENDING_QUOTATION,
  })
  status: CustomOrderStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'double precision', default: 0 })
  totalAmount: number;

  @Column({ type: 'double precision', default: 0 })
  discount: number;

  @Column({ type: 'double precision', default: 0 })
  tax: number;

  @Column({ type: 'double precision', default: 0 })
  finalAmount: number;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
