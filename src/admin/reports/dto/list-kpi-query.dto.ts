import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { KpiStatus } from '../entities';
import { ProfitLossPeriodType } from '../../finance/entities';

export class ListKpiQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(KpiStatus)
  status?: KpiStatus;

  @IsOptional()
  @IsEnum(ProfitLossPeriodType)
  periodType?: ProfitLossPeriodType;

  @IsOptional()
  @IsString()
  category?: string;
}
