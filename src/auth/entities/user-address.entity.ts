import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum AddressType {
  HOME = 'HOME',
  HOSTEL = 'HOSTEL',
  CAMPUS = 'CAMPUS',
  OFFICE = 'OFFICE',
  OTHER = 'OTHER',
}

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: AddressType, default: AddressType.HOME })
  addressType: AddressType;

  @Column()
  receiverName: string;

  @Column()
  receiverPhone: string;

  @Column({ nullable: true })
  countryId?: string;

  @Column({ nullable: true })
  divisionId?: string;

  @Column({ nullable: true })
  districtId?: string;

  @Column({ nullable: true })
  upazilaId?: string;

  @Column({ nullable: true })
  areaId?: string;

  @Column({ nullable: true })
  road?: string;

  @Column({ nullable: true })
  house?: string;

  @Column({ nullable: true })
  hostel?: string;

  @Column({ nullable: true })
  roomNumber?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  landmark?: string;

  @Column({ type: 'float', nullable: true })
  latitude?: number;

  @Column({ type: 'float', nullable: true })
  longitude?: number;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
