import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderDeliveryStatus } from '../../orders/entities';

export class UpdateDeliveryStatusDto {
  @IsEnum(OrderDeliveryStatus)
  status: OrderDeliveryStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
