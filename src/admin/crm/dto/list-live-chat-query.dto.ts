import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { LiveChatStatus } from '../entities';

export class ListLiveChatQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(LiveChatStatus)
  status?: LiveChatStatus;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
