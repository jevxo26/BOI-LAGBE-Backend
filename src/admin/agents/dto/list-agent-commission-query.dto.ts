import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { CommissionStatus } from '../entities';

export class ListAgentCommissionQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(CommissionStatus)
  status?: CommissionStatus;
}
