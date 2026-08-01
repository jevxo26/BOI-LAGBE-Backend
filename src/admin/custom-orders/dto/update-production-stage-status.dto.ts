import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CustomProductionStageStatus } from '../entities';

export class UpdateProductionStageStatusDto {
  @IsEnum(CustomProductionStageStatus)
  status: CustomProductionStageStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
