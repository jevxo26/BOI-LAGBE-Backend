import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CustomOrderStatus } from '../entities';

export class UpdateCustomOrderStatusDto {
  @IsEnum(CustomOrderStatus)
  status: CustomOrderStatus;

  @IsOptional()
  @IsString()
  remarks?: string;
}
