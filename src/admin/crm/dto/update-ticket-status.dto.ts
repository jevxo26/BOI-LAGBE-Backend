import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateTicketStatusDto {
  @IsUUID()
  statusId: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
