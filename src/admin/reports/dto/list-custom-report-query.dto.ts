import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { GeneratedReportStatus } from '../entities';
import { FinancialReportType } from '../../finance/entities';

export class ListCustomReportQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(FinancialReportType)
  reportType?: FinancialReportType;

  @IsOptional()
  @IsEnum(GeneratedReportStatus)
  status?: GeneratedReportStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
