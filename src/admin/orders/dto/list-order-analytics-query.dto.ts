import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';

export class ListOrderAnalyticsQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
