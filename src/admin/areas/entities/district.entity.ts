import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Division } from './division.entity';

export enum DistrictStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  divisionId: string;

  @ManyToOne(() => Division, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'divisionId' })
  division: Division;

  @Column()
  name: string;

  @Column({ nullable: true })
  code?: string;

  @Column({
    type: 'enum',
    enum: DistrictStatus,
    default: DistrictStatus.ACTIVE,
  })
  status: DistrictStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
