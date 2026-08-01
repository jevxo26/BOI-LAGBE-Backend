import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { UsedBookSellRequestStatus } from '../entities';

export class ListUsedBookRequestQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(UsedBookSellRequestStatus)
  status?: UsedBookSellRequestStatus;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
