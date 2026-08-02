import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SemesterStatus } from '../entities';

export class UpdateSemesterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  semesterNumber?: number;

  @IsOptional()
  @IsString()
  academicYear?: string;

  @IsOptional()
  @IsEnum(SemesterStatus)
  status?: SemesterStatus;
}
