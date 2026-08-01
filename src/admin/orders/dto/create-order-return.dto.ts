import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderReturnDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}
