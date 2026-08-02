import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TicketPriorityType {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Lookup of support ticket priorities (e.g. LOW, MEDIUM, HIGH, URGENT).
@Entity('ticket_priorities')
export class TicketPriority {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'int', default: 0 })
  level: number;

  @Column({ nullable: true })
  color?: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({
    type: 'enum',
    enum: TicketPriorityType,
    default: TicketPriorityType.ACTIVE,
  })
  status: TicketPriorityType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
