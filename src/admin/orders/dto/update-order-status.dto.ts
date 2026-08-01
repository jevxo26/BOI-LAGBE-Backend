import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../entities';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  remarks?: string;
}
