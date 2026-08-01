import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderRefundDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
