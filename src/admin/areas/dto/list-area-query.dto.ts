import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { AreaStatus } from '../entities';

// Only one geo level should be sent at a time for drill-down filtering
// (upazilaId takes precedence, then districtId, divisionId, countryId).
export class ListAreaQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(AreaStatus)
  status?: AreaStatus;

  @IsOptional()
  @IsUUID()
  upazilaId?: string;

  @IsOptional()
  @IsUUID()
  districtId?: string;

  @IsOptional()
  @IsUUID()
  divisionId?: string;

  @IsOptional()
  @IsUUID()
  countryId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
