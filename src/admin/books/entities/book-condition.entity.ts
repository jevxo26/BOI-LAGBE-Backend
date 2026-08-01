import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookConditionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('book_conditions')
export class BookCondition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Positive = price uplift, negative = discount for this condition
  @Column({ type: 'double precision', default: 0 })
  priceAdjustment: number;

  @Column({
    type: 'enum',
    enum: BookConditionStatus,
    default: BookConditionStatus.ACTIVE,
  })
  status: BookConditionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
