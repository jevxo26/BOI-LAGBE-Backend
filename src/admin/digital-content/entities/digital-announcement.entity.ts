import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('digital_announcements')
export class DigitalAnnouncement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  targetAudience?: string;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
