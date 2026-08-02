import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAgentAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  message?: string;
}
