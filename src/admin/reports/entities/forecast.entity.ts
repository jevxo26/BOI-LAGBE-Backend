import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ForecastStatus {
  ACTIVE = 'ACTIVE',
  SUPERSEDED = 'SUPERSEDED',
}

// Model output predicting a metric for a future period.
@Entity('forecasts')
export class Forecast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  forecastCode: string;

  @Column()
  metric: string;

  @Column()
  period: string;

  @Column({ type: 'double precision', default: 0 })
  forecastValue: number;

  @Column({ type: 'double precision', nullable: true })
  actualValue?: number | null;

  @Column({ type: 'double precision', nullable: true })
  confidence?: number | null;

  @Column({ nullable: true })
  model?: string;

  @Column({
    type: 'enum',
    enum: ForecastStatus,
    default: ForecastStatus.ACTIVE,
  })
  status: ForecastStatus;

  @Column({ type: 'timestamp' })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
