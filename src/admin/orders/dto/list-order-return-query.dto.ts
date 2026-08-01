import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { OrderReturnStatus } from '../entities';

export class ListOrderReturnQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(OrderReturnStatus)
  status?: OrderReturnStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
