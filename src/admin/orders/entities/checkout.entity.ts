import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CheckoutStatus {
  INITIATED = 'INITIATED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('checkouts')
export class Checkout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  cartId?: string;

  @Column({
    type: 'enum',
    enum: CheckoutStatus,
    default: CheckoutStatus.INITIATED,
  })
  status: CheckoutStatus;

  @Column({ type: 'double precision', default: 0 })
  totalAmount: number;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ type: 'timestamp', nullable: true })
  checkedOutAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
