import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomProduction } from './custom-production.entity';

export enum CustomProductionStageStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
}

@Entity('custom_production_stages')
export class CustomProductionStage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productionId: string;

  @ManyToOne(() => CustomProduction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productionId' })
  production: CustomProduction;

  @Column()
  stageName: string;

  @Column({ type: 'int', default: 1 })
  stageOrder: number;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: CustomProductionStageStatus,
    default: CustomProductionStageStatus.PENDING,
  })
  status: CustomProductionStageStatus;

  @CreateDateColumn()
  createdAt: Date;
}
