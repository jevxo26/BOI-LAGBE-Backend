import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateApprovalWorkflowDto {
  @IsString()
  @IsNotEmpty()
  module: string;

  @IsString()
  @IsNotEmpty()
  referenceId: string;

  @IsUUID()
  @IsNotEmpty()
  approvalLevelId: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
