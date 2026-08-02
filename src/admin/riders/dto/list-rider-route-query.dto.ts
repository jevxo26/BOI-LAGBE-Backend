import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { RiderRouteStatus } from '../entities';

export class ListRiderRouteQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(RiderRouteStatus)
  status?: RiderRouteStatus;
}
