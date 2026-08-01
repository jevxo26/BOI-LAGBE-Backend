import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// Shared query DTO for list endpoints. Query params arrive as strings, so
// `@Type(() => Number)` coerces page/limit before validation.
// Compose with DateRangeQueryDto in feature-specific DTOs when date filtering
// is needed, e.g.:
//   class ListUsersQueryDto extends PaginatedQueryDto {
//     @IsOptional() @IsDateString() fromDate?: string;
//     @IsOptional() @IsDateString() toDate?: string;
//   }
export class PaginatedQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(DEFAULT_PAGE)
  page?: number = DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number = DEFAULT_LIMIT;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  search?: string;
}
