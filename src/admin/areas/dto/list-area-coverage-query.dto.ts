import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { AreaCoverageStatus } from '../entities';

export class ListAreaCoverageQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsUUID()
  areaId?: string;

  @IsOptional()
  @IsUUID()
  agentId?: string;

  @IsOptional()
  @IsEnum(AreaCoverageStatus)
  status?: AreaCoverageStatus;
}
