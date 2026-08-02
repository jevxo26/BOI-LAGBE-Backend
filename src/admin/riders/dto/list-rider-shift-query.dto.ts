import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { RiderShiftStatus } from '../entities';

export class ListRiderShiftQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(RiderShiftStatus)
  status?: RiderShiftStatus;
}
