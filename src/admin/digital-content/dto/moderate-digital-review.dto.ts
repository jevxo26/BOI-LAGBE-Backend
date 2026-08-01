import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DigitalReviewStatus } from '../entities';

export class ModerateDigitalReviewDto {
  @IsEnum(DigitalReviewStatus)
  status: DigitalReviewStatus;

  @IsOptional()
  @IsString()
  remark?: string;
}
