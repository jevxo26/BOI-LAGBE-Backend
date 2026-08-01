import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Order lifecycle (admin-managed):
//   PENDING -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED
//   Branches: PENDING/CONFIRMED/PROCESSING/SHIPPED -> CANCELLED,
//   DELIVERED -> RETURNED (-> REFUNDED) or EXCHANGED.
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
  EXCHANGED = 'EXCHANGED',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderCode: string;

  // Customer (auth User id)
  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  agentId?: string;

  @Column({ nullable: true })
  riderId?: string;

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

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
