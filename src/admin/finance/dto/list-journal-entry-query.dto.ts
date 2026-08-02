import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { JournalEntryStatus, JournalEntryType } from '../entities';

export class ListJournalEntryQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(JournalEntryType)
  entryType?: JournalEntryType;

  @IsOptional()
  @IsEnum(JournalEntryStatus)
  status?: JournalEntryStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
