import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { ApprovalStatus } from '../entities';

export class ListAgentLeaveQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;
}
