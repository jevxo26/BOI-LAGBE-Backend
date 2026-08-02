import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { ApprovalStatus } from '../../agents/entities';

export class ListRiderLeaveQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;
}
