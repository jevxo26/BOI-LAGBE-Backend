import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { AgentStatus } from '../entities';

export class ListAgentQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(AgentStatus)
  status?: AgentStatus;

  // Filters agents that are assigned to the given area
  @IsOptional()
  @IsUUID()
  areaId?: string;

  // Filters agents that are assigned to the given institute
  @IsOptional()
  @IsUUID()
  instituteId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
