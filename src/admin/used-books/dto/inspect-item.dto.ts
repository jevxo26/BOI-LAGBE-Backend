import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { UsedBookCondition, UsedBookInspectionDecision } from '../entities';

export class InspectItemDto {
  @IsEnum(UsedBookCondition)
  conditionGrade: UsedBookCondition;

  @IsEnum(UsedBookInspectionDecision)
  decision: UsedBookInspectionDecision;

  @IsOptional()
  @IsBoolean()
  repairNeeded?: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;

  // Repair details (used when decision is REPAIR)
  @IsOptional()
  @IsString()
  repairType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  repairCost?: number;

  @IsOptional()
  @IsString()
  repairDescription?: string;
}
