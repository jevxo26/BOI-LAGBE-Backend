import { IsDateString, IsOptional } from 'class-validator';

export class ListDashboardQueryDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
