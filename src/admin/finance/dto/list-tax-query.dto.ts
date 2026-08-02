import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { TaxStatus, TaxType } from '../entities';

export class ListTaxQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(TaxType)
  taxType?: TaxType;

  @IsOptional()
  @IsEnum(TaxStatus)
  status?: TaxStatus;
}
