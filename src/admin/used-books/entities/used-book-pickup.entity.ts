import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsedBookSellRequest } from './used-book-sell-request.entity';

export enum UsedBookPickupStatus {
  SCHEDULED = 'SCHEDULED',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('used_book_pickups')
export class UsedBookPickup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requestId: string;

  @ManyToOne(() => UsedBookSellRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requestId' })
  request: UsedBookSellRequest;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'text' })
  address: string;

  @Column({ nullable: true })
  contactName?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({
    type: 'enum',
    enum: UsedBookPickupStatus,
    default: UsedBookPickupStatus.SCHEDULED,
  })
  status: UsedBookPickupStatus;

  @Column()
  scheduledBy: string;

  @Column({ type: 'timestamp', nullable: true })
  pickedUpAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
