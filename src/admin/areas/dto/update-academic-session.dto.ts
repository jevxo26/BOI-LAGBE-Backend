import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AcademicSessionStatus } from '../entities';

export class UpdateAcademicSessionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(AcademicSessionStatus)
  status?: AcademicSessionStatus;
}
