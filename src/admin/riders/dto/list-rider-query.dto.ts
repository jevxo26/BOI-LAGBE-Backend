import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { RiderStatus } from '../entities';

export class ListRiderQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(RiderStatus)
  status?: RiderStatus;

  // Filters riders that are assigned to the given area
  @IsOptional()
  @IsUUID()
  areaId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
