import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';

export class ListRiderHistoryQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
