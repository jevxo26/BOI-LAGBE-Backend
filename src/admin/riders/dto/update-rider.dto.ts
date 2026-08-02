import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RiderEmploymentType, RiderSalaryType } from '../entities';

export class UpdateRiderDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @IsOptional()
  @IsEnum(RiderEmploymentType)
  employmentType?: RiderEmploymentType;

  @IsOptional()
  @IsEnum(RiderSalaryType)
  salaryType?: RiderSalaryType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  baseSalary?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  commissionRate?: number;
}
