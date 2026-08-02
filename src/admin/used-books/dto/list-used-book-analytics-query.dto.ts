import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';

export class ListUsedBookAnalyticsQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsString()
  metric?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
