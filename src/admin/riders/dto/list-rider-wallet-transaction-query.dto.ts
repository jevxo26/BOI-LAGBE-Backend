import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { WalletTransactionType } from '../../agents/entities';

export class ListRiderWalletTransactionQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(WalletTransactionType)
  transactionType?: WalletTransactionType;
}
