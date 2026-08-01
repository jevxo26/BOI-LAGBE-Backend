import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rider } from './rider.entity';

@Entity('rider_wallets')
export class RiderWallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column({ type: 'double precision', default: 0 })
  currentBalance: number;

  @Column({ type: 'double precision', default: 0 })
  totalEarned: number;

  @Column({ type: 'double precision', default: 0 })
  totalWithdraw: number;

  @Column({ type: 'timestamp', nullable: true })
  lastUpdated?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
