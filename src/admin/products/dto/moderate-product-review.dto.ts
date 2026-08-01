import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProductReviewStatus } from '../entities';

export class ModerateProductReviewDto {
  @IsEnum(ProductReviewStatus)
  @IsNotEmpty()
  status: ProductReviewStatus;

  @IsOptional()
  @IsString()
  remark?: string;
}
