import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { WalletTransactionType } from '../entities';

export class ListAgentWalletTransactionQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(WalletTransactionType)
  transactionType?: WalletTransactionType;
}
