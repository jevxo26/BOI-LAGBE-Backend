import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { ApprovalWorkflowStatus } from '../entities';

export class ListApprovalWorkflowQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(ApprovalWorkflowStatus)
  status?: ApprovalWorkflowStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
