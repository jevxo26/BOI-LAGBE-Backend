import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('gift_messages')
export class GiftMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  giftProductId?: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  fromName?: string;

  @Column({ nullable: true })
  toName?: string;

  @CreateDateColumn()
  createdAt: Date;
}
