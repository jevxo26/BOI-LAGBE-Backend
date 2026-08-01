import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { UsedBookCondition } from '../entities';

export class GenerateOfferDto {
  @IsEnum(UsedBookCondition)
  conditionGrade: UsedBookCondition;

  @IsNumber()
  @Min(0)
  estimatedPrice: number;

  @IsNumber()
  @Min(0)
  offerAmount: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
