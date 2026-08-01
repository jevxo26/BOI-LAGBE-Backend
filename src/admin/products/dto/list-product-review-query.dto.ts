import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { ProductReviewStatus } from '../entities';

export class ListProductReviewQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(ProductReviewStatus)
  status?: ProductReviewStatus;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
