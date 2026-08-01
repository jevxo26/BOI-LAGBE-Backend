import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApproveStockTransferDto {
  // true = approve (stock moves between warehouses), false = reject
  @IsBoolean()
  @IsNotEmpty()
  approve: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;
}
