import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateAreaCoverageDto {
  @IsUUID()
  @IsNotEmpty()
  areaId: string;

  @IsUUID()
  @IsNotEmpty()
  agentId: string;

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
}
