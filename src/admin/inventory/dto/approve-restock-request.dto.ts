import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ApproveRestockRequestDto {
  // true = approve (stock is added), false = reject
  @IsBoolean()
  @IsNotEmpty()
  approve: boolean;

  // Quantity actually approved; defaults to the requested quantity
  @IsOptional()
  @IsInt()
  @Min(1)
  approvedQuantity?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
