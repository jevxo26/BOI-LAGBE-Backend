import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { AreaCoverageStatus } from '../entities';

export class UpdateAreaCoverageDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priority?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deliveryCharge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estimatedTime?: number;

  @IsOptional()
  @IsEnum(AreaCoverageStatus)
  status?: AreaCoverageStatus;
}
