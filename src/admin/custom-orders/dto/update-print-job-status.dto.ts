import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PrintJobStatus } from '../entities';

export class UpdatePrintJobStatusDto {
  @IsEnum(PrintJobStatus)
  status: PrintJobStatus;

  @IsOptional()
  @IsString()
  remarks?: string;
}
