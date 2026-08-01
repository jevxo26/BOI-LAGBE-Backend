import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { BookReviewStatus } from '../entities';

export class ListBookReviewQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(BookReviewStatus)
  status?: BookReviewStatus;

  @IsOptional()
  @IsUUID()
  bookId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
