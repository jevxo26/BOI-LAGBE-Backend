import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductAttributeType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  COLOR = 'COLOR',
  BOOLEAN = 'BOOLEAN',
}

export enum ProductAttributeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('product_attributes')
export class ProductAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({
    type: 'enum',
    enum: ProductAttributeType,
    default: ProductAttributeType.TEXT,
  })
  type: ProductAttributeType;

  @Column({
    type: 'enum',
    enum: ProductAttributeStatus,
    default: ProductAttributeStatus.ACTIVE,
  })
  status: ProductAttributeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
