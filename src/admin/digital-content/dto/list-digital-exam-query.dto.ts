import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { DigitalExamStatus } from '../entities';

export class ListDigitalExamQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(DigitalExamStatus)
  status?: DigitalExamStatus;

  @IsOptional()
  @IsUUID()
  contentId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
