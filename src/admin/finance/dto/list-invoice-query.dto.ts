import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { InvoiceStatus } from '../entities';

export class ListInvoiceQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsOptional()
  @IsUUID()
  orderId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
