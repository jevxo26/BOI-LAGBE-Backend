import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { InstituteCampusStatus } from '../entities';

export class UpdateInstituteCampusDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(InstituteCampusStatus)
  status?: InstituteCampusStatus;
}
