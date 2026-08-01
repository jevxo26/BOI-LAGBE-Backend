import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PrintService } from './print-service.entity';

@Entity('print_pricings')
export class PrintPricing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serviceId: string;

  @ManyToOne(() => PrintService, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: PrintService;

  @Column({ nullable: true })
  pageRange?: string;

  @Column({ type: 'double precision', default: 0 })
  pricePerPage: number;

  @Column({ type: 'double precision', default: 0 })
  pricePerCopy: number;

  @Column({ type: 'int', default: 1 })
  minQuantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
