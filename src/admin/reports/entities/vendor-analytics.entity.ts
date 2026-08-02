import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated supplier/vendor metrics per period — populated by BI jobs.
@Entity('vendor_analytics')
export class VendorAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalVendors: number;

  @Column({ type: 'int', default: 0 })
  activeVendors: number;

  @Column({ type: 'int', default: 0 })
  totalPurchases: number;

  @Column({ type: 'double precision', default: 0 })
  totalPurchaseAmount: number;

  @Column({ type: 'double precision', default: 0 })
  totalPaidAmount: number;

  @Column({ type: 'double precision', default: 0 })
  outstandingAmount: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
