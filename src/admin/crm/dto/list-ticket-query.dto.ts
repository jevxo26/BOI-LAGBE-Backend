import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { TicketChannel } from '../entities';

export class ListTicketQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsUUID()
  statusId?: string;

  @IsOptional()
  @IsUUID()
  priorityId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsEnum(TicketChannel)
  channel?: TicketChannel;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
