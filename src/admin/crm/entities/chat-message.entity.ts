import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LiveChat } from './live-chat.entity';

export enum ChatSenderType {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  SYSTEM = 'SYSTEM',
}

// One message inside a live chat session.
@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chatId: string;

  @ManyToOne(() => LiveChat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatId' })
  chat: LiveChat;

  @Column({ type: 'enum', enum: ChatSenderType })
  senderType: ChatSenderType;

  @Column({ nullable: true })
  senderId?: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
