import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddDeliveryTrackingDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
