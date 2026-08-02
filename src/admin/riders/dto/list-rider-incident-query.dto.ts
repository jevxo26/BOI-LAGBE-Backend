import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { IncidentSeverity, IncidentStatus } from '../entities';

export class ListRiderIncidentQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;
}
