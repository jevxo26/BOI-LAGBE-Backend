import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ContactMessageStatus {
  NEW = 'NEW',
  REPLIED = 'REPLIED',
  CLOSED = 'CLOSED',
}

// Contact-form message submitted through the website/app.
@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: ContactMessageStatus,
    default: ContactMessageStatus.NEW,
  })
  status: ContactMessageStatus;

  @Column({ nullable: true })
  repliedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  repliedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
