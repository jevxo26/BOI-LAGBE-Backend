import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TicketStatusType {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Lookup of support ticket statuses (e.g. OPEN, IN_PROGRESS, RESOLVED).
@Entity('ticket_statuses')
export class TicketStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({
    type: 'enum',
    enum: TicketStatusType,
    default: TicketStatusType.ACTIVE,
  })
  status: TicketStatusType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
