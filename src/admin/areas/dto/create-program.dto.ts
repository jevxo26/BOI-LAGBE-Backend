import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProgramDto {
  @IsUUID()
  @IsNotEmpty()
  departmentId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

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
}
