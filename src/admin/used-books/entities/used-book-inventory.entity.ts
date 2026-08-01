import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookItem } from './used-book-item.entity';

export enum UsedBookInventoryStatus {
  IN_STOCK = 'IN_STOCK',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  DAMAGED = 'DAMAGED',
}

// The accepted used-book item once it physically reaches stock and is ready
// to be listed for resale.
@Entity('used_book_inventories')
export class UsedBookInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => UsedBookItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: UsedBookItem;

  @Column({ nullable: true })
  warehouseId?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({
    type: 'enum',
    enum: UsedBookInventoryStatus,
    default: UsedBookInventoryStatus.IN_STOCK,
  })
  status: UsedBookInventoryStatus;

  @Column({ type: 'timestamp' })
  receivedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
