import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @IsUUID()
  @IsNotEmpty()
  instituteId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
