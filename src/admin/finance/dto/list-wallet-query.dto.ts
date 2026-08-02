import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { WalletStatus, WalletType } from '../entities';

export class ListWalletQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(WalletType)
  walletType?: WalletType;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(WalletStatus)
  status?: WalletStatus;
}
