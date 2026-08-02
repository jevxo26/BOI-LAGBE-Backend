import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMessage } from './chat-message.entity';

// File attached to a chat message.
@Entity('chat_attachments')
export class ChatAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @ManyToOne(() => ChatMessage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'messageId' })
  message: ChatMessage;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  fileType?: string;

  @Column({ type: 'int', nullable: true })
  fileSize?: number | null;

  @Column({ nullable: true })
  uploadedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}
