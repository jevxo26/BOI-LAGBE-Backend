import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PermissionStatus } from '../entities';

export class CreatePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  moduleId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(PermissionStatus)
  status?: PermissionStatus;
}
