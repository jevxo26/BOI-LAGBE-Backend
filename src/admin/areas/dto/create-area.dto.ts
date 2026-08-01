import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AreaStatus } from '../entities';

export class CreateAreaDto {
  @IsUUID()
  @IsNotEmpty()
  upazilaId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  deliveryCharge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minimumDeliveryDays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maximumDeliveryDays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsEnum(AreaStatus)
  status?: AreaStatus;
}
