import { IsNumber, IsOptional, Min } from 'class-validator';

export class RepriceItemDto {
  @IsNumber()
  @Min(0)
  sellingPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}
