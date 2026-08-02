import { IsOptional, IsString } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';

export class ListRiderReportQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsString()
  reportType?: string;
}
