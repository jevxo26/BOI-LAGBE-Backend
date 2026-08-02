import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateSemesterDto {
  @IsUUID()
  @IsNotEmpty()
  programId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  semesterNumber?: number;

  @IsOptional()
  @IsString()
  academicYear?: string;
}
