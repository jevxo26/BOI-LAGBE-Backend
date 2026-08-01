import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../../../auth/entities';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';

export class ListUserQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  // Matches against the `roles` simple-array column (e.g. 'ADMIN', 'AGENT')
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
