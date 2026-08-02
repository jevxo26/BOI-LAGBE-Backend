import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { FinancialReportType } from '../entities';

export class ListFinancialReportQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(FinancialReportType)
  reportType?: FinancialReportType;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
