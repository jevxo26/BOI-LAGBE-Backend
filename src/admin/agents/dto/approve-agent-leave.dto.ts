import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApprovalStatus } from '../entities';

export class ApproveAgentLeaveDto {
  @IsEnum(ApprovalStatus)
  @IsNotEmpty()
  approvalStatus: ApprovalStatus;
}
