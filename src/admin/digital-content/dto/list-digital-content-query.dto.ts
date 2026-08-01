import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { DigitalContentStatus, DigitalContentType } from '../entities';

export class ListDigitalContentQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(DigitalContentStatus)
  status?: DigitalContentStatus;

  @IsOptional()
  @IsEnum(DigitalContentType)
  type?: DigitalContentType;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsUUID()
  publisherId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
