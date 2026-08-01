import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DigitalInstituteStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('digital_institutes')
export class DigitalInstitute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  shortName?: string;

  @Column({ nullable: true })
  type?: string;

  @Column({
    type: 'enum',
    enum: DigitalInstituteStatus,
    default: DigitalInstituteStatus.ACTIVE,
  })
  status: DigitalInstituteStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
