import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { EmployeeType, SalaryPaymentStatus } from '../entities';

export class ListSalaryQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(EmployeeType)
  employeeType?: EmployeeType;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsEnum(SalaryPaymentStatus)
  paymentStatus?: SalaryPaymentStatus;
}
