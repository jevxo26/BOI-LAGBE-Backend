import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PrintServiceStatus } from '../entities';

export class CreatePrintServiceDto {
  @IsString()
  @IsNotEmpty()
  serviceCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerPage?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minOrder?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxOrder?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  turnaroundDays?: number;

  @IsOptional()
  @IsEnum(PrintServiceStatus)
  status?: PrintServiceStatus;
}
