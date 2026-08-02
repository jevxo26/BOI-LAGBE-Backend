import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ProgramStatus } from '../entities';

export class UpdateProgramDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  credit?: number;

  @IsOptional()
  @IsEnum(ProgramStatus)
  status?: ProgramStatus;
}
