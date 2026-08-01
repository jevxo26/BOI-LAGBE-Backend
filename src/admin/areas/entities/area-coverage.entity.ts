import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Area } from './area.entity';

export enum AreaCoverageStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('area_coverages')
export class AreaCoverage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  areaId: string;

  @ManyToOne(() => Area, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'areaId' })
  area: Area;

  @Column()
  agentId: string;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'double precision', default: 0 })
  deliveryCharge: number;

  @Column({ type: 'int', nullable: true })
  estimatedTime?: number;

  @Column({
    type: 'enum',
    enum: AreaCoverageStatus,
    default: AreaCoverageStatus.ACTIVE,
  })
  status: AreaCoverageStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
