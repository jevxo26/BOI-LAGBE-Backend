import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentGatewayStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

// Payment gateway registry. This module performs NO gateway integration —
// the record is administrative metadata only.
@Entity('payment_gateways')
export class PaymentGateway {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  gatewayCode: string;

  @Column()
  name: string;

  @Column()
  provider: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  config?: Record<string, unknown>;

  @Column({ default: false })
  isDefault: boolean;

  @Column({
    type: 'enum',
    enum: PaymentGatewayStatus,
    default: PaymentGatewayStatus.ACTIVE,
  })
  status: PaymentGatewayStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
