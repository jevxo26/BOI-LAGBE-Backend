import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum GiftWrappingStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('gift_wrappings')
export class GiftWrapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'double precision', default: 0 })
  price: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({
    type: 'enum',
    enum: GiftWrappingStatus,
    default: GiftWrappingStatus.ACTIVE,
  })
  status: GiftWrappingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
