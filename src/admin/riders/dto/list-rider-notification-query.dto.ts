import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';

export class ListRiderNotificationQueryDto extends PaginatedQueryDto {
  // Query params arrive as strings, so @Type coerces "true"/"false" before
  // @IsBoolean validates (mirrors @Type(() => Number) on page/limit).
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isRead?: boolean;
}
