import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ApproveCustomOrderDto {
  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;
}
