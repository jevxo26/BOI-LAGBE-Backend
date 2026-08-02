import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { CommissionStatus, CommissionType } from '../entities';

export class ListCommissionQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(CommissionType)
  commissionType?: CommissionType;

  @IsOptional()
  @IsEnum(CommissionStatus)
  status?: CommissionStatus;

  @IsOptional()
  @IsUUID()
  agentId?: string;

  @IsOptional()
  @IsUUID()
  riderId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
