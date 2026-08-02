import { IsDateString, IsEnum, IsObject, IsOptional } from 'class-validator';
import { ExportFormat } from '../entities';
import { FinancialReportType } from '../../finance/entities';

export class ExportReportDto {
  @IsEnum(FinancialReportType)
  reportType: FinancialReportType;

  @IsEnum(ExportFormat)
  format: ExportFormat;

  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, unknown>;
}
