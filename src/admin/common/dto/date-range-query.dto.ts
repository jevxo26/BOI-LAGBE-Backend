import { IsDateString, IsOptional } from 'class-validator';

// Shared query DTO for filtering list endpoints by a date range.
// Values are ISO 8601 date or datetime strings (e.g. 2026-07-01 or
// 2026-07-01T00:00:00Z) applied against the entity's date field chosen by the
// consumer (see QueryBuilder.buildQueryOptions -> dateField).
export class DateRangeQueryDto {
  // Inclusive start of the range
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  // Inclusive end of the range
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
