import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class ApproveOfferDto {
  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsUUID()
  offerId?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
