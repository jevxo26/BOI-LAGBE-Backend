import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { LoyaltyPointType } from '../entities';

export class ListLoyaltyQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsEnum(LoyaltyPointType)
  pointType?: LoyaltyPointType;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
