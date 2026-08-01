import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionGroup } from './permission-group.entity';
import { Permission } from './permission.entity';

export enum SystemModuleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('system_modules')
export class SystemModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  permissionGroupId: string;

  @ManyToOne(() => PermissionGroup, (group) => group.modules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permissionGroupId' })
  permissionGroup: PermissionGroup;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  route?: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({
    type: 'enum',
    enum: SystemModuleStatus,
    default: SystemModuleStatus.ACTIVE,
  })
  status: SystemModuleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Permission, (permission) => permission.module)
  permissions: Permission[];
}
