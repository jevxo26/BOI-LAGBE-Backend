import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { SettlementEntityType, SettlementPaymentStatus } from '../entities';

export class ListSettlementQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(SettlementEntityType)
  entityType?: SettlementEntityType;

  @IsOptional()
  @IsUUID()
  entityId?: string;

  @IsOptional()
  @IsEnum(SettlementPaymentStatus)
  paymentStatus?: SettlementPaymentStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
