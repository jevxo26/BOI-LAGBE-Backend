import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { DashboardStatus } from '../entities';

export class ListDashboardQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(DashboardStatus)
  status?: DashboardStatus;
}
