import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentRestockRequest } from './agent-restock-request.entity';

@Entity('agent_restock_items')
export class AgentRestockItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restockRequestId: string;

  @ManyToOne(() => AgentRestockRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restockRequestId' })
  restockRequest: AgentRestockRequest;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  receivedQuantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
