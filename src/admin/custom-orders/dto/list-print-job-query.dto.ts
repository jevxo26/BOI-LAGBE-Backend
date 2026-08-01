import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { PrintJobStatus } from '../entities';

export class ListPrintJobQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(PrintJobStatus)
  status?: PrintJobStatus;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
