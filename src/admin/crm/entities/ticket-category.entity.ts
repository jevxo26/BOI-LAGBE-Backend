import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TicketCategoryType {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Lookup of support ticket categories (e.g. ORDER, PAYMENT, DELIVERY, OTHER).
@Entity('ticket_categories')
export class TicketCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({
    type: 'enum',
    enum: TicketCategoryType,
    default: TicketCategoryType.ACTIVE,
  })
  status: TicketCategoryType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
