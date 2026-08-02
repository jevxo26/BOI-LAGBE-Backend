import {
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { FinancialReportType } from '../../finance/entities';

export class GenerateReportDto {
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @IsEnum(FinancialReportType)
  reportType: FinancialReportType;

  @IsString()
  title: string;

  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @IsOptional()
  @IsObject()
  params?: Record<string, unknown>;
}
