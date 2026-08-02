import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LiveChatStatus {
  OPEN = 'OPEN',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  TRANSFERRED = 'TRANSFERRED',
}

// A customer support chat session.
@Entity('live_chats')
export class LiveChat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  chatCode: string;

  @Column()
  customerId: string;

  @Column({
    type: 'enum',
    enum: LiveChatStatus,
    default: LiveChatStatus.OPEN,
  })
  status: LiveChatStatus;

  @Column({ nullable: true })
  assignedTo?: string;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastMessageAt?: Date | null;

  @Column({ type: 'int', nullable: true })
  rating?: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
