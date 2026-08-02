import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { VehicleStatus, VehicleType } from '../entities';

export class ListRiderVehicleQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}
