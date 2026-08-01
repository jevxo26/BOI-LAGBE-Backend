import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';

export class ListDigitalAnalyticsQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsUUID()
  contentId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
