import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class AddProductionStageDto {
  @IsString()
  @IsNotEmpty()
  stageName: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  stageOrder?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
