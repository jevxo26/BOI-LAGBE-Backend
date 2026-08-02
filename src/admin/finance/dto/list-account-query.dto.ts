import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { AccountStatus, AccountType } from '../entities';

export class ListAccountQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;
}
