import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { RiderAvailabilityStatus } from '../entities';

export class ListRiderAvailabilityQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(RiderAvailabilityStatus)
  status?: RiderAvailabilityStatus;
}
