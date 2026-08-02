import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { RiderOtpStatus } from '../entities';

export class ListRiderOtpQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(RiderOtpStatus)
  status?: RiderOtpStatus;
}
