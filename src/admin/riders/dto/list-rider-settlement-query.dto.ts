import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { PaymentStatus } from '../../agents/entities';

export class ListRiderSettlementQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
