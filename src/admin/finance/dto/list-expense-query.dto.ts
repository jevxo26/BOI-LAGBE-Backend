import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { ExpenseStatus } from '../entities';

export class ListExpenseQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(ExpenseStatus)
  status?: ExpenseStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
