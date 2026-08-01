import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { OrderDeliveryStatus } from '../../orders/entities';

export class ListDeliveryQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(OrderDeliveryStatus)
  status?: OrderDeliveryStatus;

  @IsOptional()
  @IsUUID()
  riderId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
