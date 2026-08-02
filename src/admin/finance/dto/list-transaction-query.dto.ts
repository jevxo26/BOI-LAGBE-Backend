import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { PaymentDirection, PaymentTransactionStatus } from '../entities';

export class ListTransactionQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(PaymentTransactionStatus)
  status?: PaymentTransactionStatus;

  @IsOptional()
  @IsEnum(PaymentDirection)
  direction?: PaymentDirection;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  gatewayId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
