import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AgentStatus, EmploymentType, SalaryType } from '../entities';

export class UpdateAgentDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsDateString()
  @IsOptional()
  joiningDate?: string;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsOptional()
  @IsEnum(SalaryType)
  salaryType?: SalaryType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  baseSalary?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  commissionRate?: number;

  @IsString()
  @IsOptional()
  warehouseId?: string;

  @IsOptional()
  @IsEnum(AgentStatus)
  status?: AgentStatus;
}
