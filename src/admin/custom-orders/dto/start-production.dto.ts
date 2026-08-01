import { IsDateString, IsOptional, IsString } from 'class-validator';

export class StartProductionDto {
  @IsOptional()
  @IsDateString()
  estimatedCompletionDate?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
