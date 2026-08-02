import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApprovalStatus } from '../../agents/entities';

export class ApproveRiderLeaveDto {
  @IsEnum(ApprovalStatus)
  @IsNotEmpty()
  approvalStatus: ApprovalStatus;
}
