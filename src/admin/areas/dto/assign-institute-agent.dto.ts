import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignInstituteAgentDto {
  @IsUUID()
  @IsNotEmpty()
  agentId: string;
}
