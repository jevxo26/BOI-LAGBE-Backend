import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { StudentStatus } from '../entities';

export class ListStudentInstituteQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  instituteId?: string;

  @IsOptional()
  @IsUUID()
  programId?: string;

  @IsOptional()
  @IsEnum(StudentStatus)
  studentStatus?: StudentStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
