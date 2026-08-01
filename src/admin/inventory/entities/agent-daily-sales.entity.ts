import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentStore } from '../../agents/entities';

@Entity('agent_daily_sales')
export class AgentDailySales {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => AgentStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: AgentStore;

  @Column({ type: 'date' })
  saleDate: string;

  @Column({ type: 'int', default: 0 })
  totalOrders: number;

  @Column({ type: 'double precision', default: 0 })
  totalSales: number;

  @Column({ type: 'double precision', default: 0 })
  totalDiscount: number;

  @Column({ type: 'double precision', default: 0 })
  totalTax: number;

  @Column({ type: 'double precision', default: 0 })
  totalProfit: number;

  @CreateDateColumn()
  createdAt: Date;
}
