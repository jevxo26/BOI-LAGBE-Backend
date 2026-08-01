import { IsEnum, IsNotEmpty } from 'class-validator';
import { AgentStatus } from '../entities';

export class UpdateAgentStatusDto {
  @IsEnum(AgentStatus)
  @IsNotEmpty()
  status: AgentStatus;
}
