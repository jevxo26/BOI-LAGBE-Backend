import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rider } from './rider.entity';

export enum EarningType {
  DELIVERY_FEE = 'DELIVERY_FEE',
  TIP = 'TIP',
  BONUS = 'BONUS',
}

export enum EarningStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

@Entity('rider_earnings')
export class RiderEarning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column()
  orderId: string;

  @Column({
    type: 'enum',
    enum: EarningType,
    default: EarningType.DELIVERY_FEE,
  })
  earningType: EarningType;

  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: EarningStatus, default: EarningStatus.PENDING })
  status: EarningStatus;

  @CreateDateColumn()
  createdAt: Date;
}
