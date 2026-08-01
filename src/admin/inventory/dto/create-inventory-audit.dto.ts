import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateInventoryAuditDto {
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;

  // System count for the warehouse at audit time
  @IsInt()
  @Min(0)
  expectedStock: number;

  // Physically counted stock
  @IsInt()
  @Min(0)
  physicalStock: number;

  @IsOptional()
  @IsDateString()
  auditDate?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
