import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { DigitalCertificateStatus } from '../entities';

export class ListDigitalCertificateQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(DigitalCertificateStatus)
  status?: DigitalCertificateStatus;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
