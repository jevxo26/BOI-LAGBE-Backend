import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderExchangeDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}
