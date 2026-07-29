import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.preference, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: 'bn' })
  language: string;

  @Column({ default: 'BDT' })
  currency: string;

  @Column({ default: 'light' })
  theme: string;

  @Column({ default: 'Asia/Dhaka' })
  timezone: string;

  @Column({ nullable: true })
  favoriteCategory?: string;

  @Column({ nullable: true })
  favoriteInstitute?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
