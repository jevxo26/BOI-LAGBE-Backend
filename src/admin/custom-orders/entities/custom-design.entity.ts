import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CustomDesignStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('custom_designs')
export class CustomDesign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  itemId?: string;

  @Column()
  userId: string;

  @Column()
  designName: string;

  @Column({ nullable: true })
  designUrl?: string;

  @Column({
    type: 'enum',
    enum: CustomDesignStatus,
    default: CustomDesignStatus.DRAFT,
  })
  status: CustomDesignStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
