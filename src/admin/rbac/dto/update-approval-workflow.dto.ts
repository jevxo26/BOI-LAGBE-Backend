import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApprovalWorkflowStatus } from '../entities';

export class UpdateApprovalWorkflowDto {
  @IsOptional()
  @IsEnum(ApprovalWorkflowStatus)
  status?: ApprovalWorkflowStatus;

  @IsOptional()
  @IsString()
  remarks?: string;
}
