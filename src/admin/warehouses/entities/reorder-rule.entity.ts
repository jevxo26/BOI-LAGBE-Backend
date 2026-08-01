import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reorder_rules')
export class ReorderRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column({ type: 'int', default: 0 })
  minimumStock: number;

  @Column({ type: 'int', default: 0 })
  reorderQuantity: number;

  @Column({ nullable: true })
  preferredSupplierId?: string;

  @Column({ default: false })
  autoRestock: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
