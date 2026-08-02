import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { EarningStatus, EarningType } from '../entities';

export class ListRiderEarningQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(EarningType)
  earningType?: EarningType;

  @IsOptional()
  @IsEnum(EarningStatus)
  status?: EarningStatus;
}
