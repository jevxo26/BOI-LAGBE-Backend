import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DepartmentStatus } from '../entities';

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(DepartmentStatus)
  status?: DepartmentStatus;
}
