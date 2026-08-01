import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum OrderPackageStatus {
  PACKING = 'PACKING',
  READY = 'READY',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

@Entity('order_packages')
export class OrderPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ unique: true })
  packageCode: string;

  @Column({ type: 'double precision', nullable: true })
  weight?: number;

  @Column({
    type: 'enum',
    enum: OrderPackageStatus,
    default: OrderPackageStatus.PACKING,
  })
  status: OrderPackageStatus;

  @CreateDateColumn()
  createdAt: Date;
}
