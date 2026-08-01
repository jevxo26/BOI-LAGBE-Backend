import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inventory } from './inventory.entity';

export enum StockReservationStatus {
  ACTIVE = 'ACTIVE',
  RELEASED = 'RELEASED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('stock_reservations')
export class StockReservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inventoryId: string;

  @ManyToOne(() => Inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;

  @Column({ nullable: true })
  orderId?: string;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  reservedQuantity: number;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({
    type: 'enum',
    enum: StockReservationStatus,
    default: StockReservationStatus.ACTIVE,
  })
  status: StockReservationStatus;

  @CreateDateColumn()
  createdAt: Date;
}
