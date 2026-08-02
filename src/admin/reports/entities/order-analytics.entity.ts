import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfitLossPeriodType } from '../../finance/entities';

// Aggregated order lifecycle metrics per period — populated by BI jobs.
// Named ReportsOrderAnalytics when exported to avoid clashing with the
// order lifecycle OrderAnalytics entity in src/admin/orders.
@Entity('bi_order_analytics')
export class OrderAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @Column({ type: 'enum', enum: ProfitLossPeriodType })
  periodType: ProfitLossPeriodType;

  @Column({ type: 'int', default: 0 })
  totalOrders: number;

  @Column({ type: 'int', default: 0 })
  confirmedOrders: number;

  @Column({ type: 'int', default: 0 })
  shippedOrders: number;

  @Column({ type: 'int', default: 0 })
  deliveredOrders: number;

  @Column({ type: 'int', default: 0 })
  cancelledOrders: number;

  @Column({ type: 'int', default: 0 })
  returnedOrders: number;

  @Column({ type: 'int', default: 0 })
  refundedOrders: number;

  @Column({ type: 'double precision', default: 0 })
  avgOrderValue: number;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
