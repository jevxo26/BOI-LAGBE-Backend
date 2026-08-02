import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { StudentStatus } from '../entities';

export class CreateStudentInstituteDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  instituteId: string;

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
