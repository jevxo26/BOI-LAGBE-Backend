import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomOrder } from './custom-order.entity';

export enum CustomApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Internal approval record raised when an admin approves the quotation of a
// custom order, moving it into production.
@Entity('custom_approvals')
export class CustomApproval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => CustomOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: CustomOrder;

  @Column({ nullable: true })
  quotationId?: string;

  @Column()
  requestedBy: string;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({
    type: 'enum',
    enum: CustomApprovalStatus,
    default: CustomApprovalStatus.PENDING,
  })
  status: CustomApprovalStatus;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
