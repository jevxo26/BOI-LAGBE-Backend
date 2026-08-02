import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { ProfitLossPeriodType } from '../../finance/entities';

export class ListRevenueAnalyticsQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(ProfitLossPeriodType)
  periodType?: ProfitLossPeriodType;

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
