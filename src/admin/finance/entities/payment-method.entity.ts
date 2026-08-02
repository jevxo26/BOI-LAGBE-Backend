import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentMethodType {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOBILE_BANKING = 'MOBILE_BANKING',
  WALLET = 'WALLET',
  COD = 'COD',
}

export enum PaymentMethodStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  methodCode: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PaymentMethodType })
  methodType: PaymentMethodType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodStatus,
    default: PaymentMethodStatus.ACTIVE,
  })
  status: PaymentMethodStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
