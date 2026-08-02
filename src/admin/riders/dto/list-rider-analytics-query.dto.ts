import { IsDateString, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';

export class ListRiderAnalyticsQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
