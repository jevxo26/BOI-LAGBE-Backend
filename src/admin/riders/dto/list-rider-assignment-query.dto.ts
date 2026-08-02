import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { RiderAssignmentStatus } from '../entities';

export class ListRiderAssignmentQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(RiderAssignmentStatus)
  status?: RiderAssignmentStatus;
}
