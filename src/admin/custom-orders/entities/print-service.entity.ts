import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PrintServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('print_services')
export class PrintService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  serviceCode: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'double precision', nullable: true })
  pricePerPage?: number;

  @Column({ type: 'int', nullable: true })
  minOrder?: number;

  @Column({ type: 'int', nullable: true })
  maxOrder?: number;

  @Column({ type: 'int', default: 3 })
  turnaroundDays: number;

  @Column({
    type: 'enum',
    enum: PrintServiceStatus,
    default: PrintServiceStatus.ACTIVE,
  })
  status: PrintServiceStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
