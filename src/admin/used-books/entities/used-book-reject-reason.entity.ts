import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UsedBookRejectReasonStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Reusable, admin-managed rejection reasons attached to rejected sell
// requests / items so sellers get a consistent explanation.
@Entity('used_book_reject_reasons')
export class UsedBookRejectReason {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: UsedBookRejectReasonStatus,
    default: UsedBookRejectReasonStatus.ACTIVE,
  })
  status: UsedBookRejectReasonStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
