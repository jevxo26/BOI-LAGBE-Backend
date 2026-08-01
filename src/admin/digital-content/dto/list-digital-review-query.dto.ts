import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { DigitalReviewStatus } from '../entities';

export class ListDigitalReviewQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(DigitalReviewStatus)
  status?: DigitalReviewStatus;

  @IsOptional()
  @IsUUID()
  contentId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
