import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { StudentStatus } from '../entities';

export class UpdateStudentInstituteDto {
  @IsOptional()
  @IsUUID()
  campusId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  programId?: string;

  @IsOptional()
  @IsUUID()
  semesterId?: string;

  @IsOptional()
  @IsUUID()
  academicSessionId?: string;

  @IsOptional()
  @IsString()
  studentRoll?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsEnum(StudentStatus)
  studentStatus?: StudentStatus;
}
