import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rider } from './rider.entity';

export enum ProofType {
  PHOTO = 'PHOTO',
  SIGNATURE = 'SIGNATURE',
  OTP = 'OTP',
}

@Entity('rider_proofs')
export class RiderProof {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @ManyToOne(() => Rider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column({ nullable: true })
  deliveryId?: string;

  @Column({ type: 'enum', enum: ProofType, default: ProofType.PHOTO })
  proofType: ProofType;

  @Column({ nullable: true })
  fileUrl?: string;

  @CreateDateColumn()
  createdAt: Date;
}
