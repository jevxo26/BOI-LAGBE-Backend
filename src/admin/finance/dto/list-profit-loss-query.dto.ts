import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { ProfitLossPeriodType } from '../entities';

export class ListProfitLossQueryDto extends PaginatedQueryDto {
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
