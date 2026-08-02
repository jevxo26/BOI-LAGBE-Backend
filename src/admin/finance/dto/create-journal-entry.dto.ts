import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { JournalEntryType, LedgerTransactionType } from '../entities';

export class JournalEntryLineDto {
  @IsUUID()
  accountId: string;

  @IsEnum(LedgerTransactionType)
  transactionType: LedgerTransactionType;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateJournalEntryDto {
  @IsDateString()
  entryDate: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(JournalEntryType)
  entryType?: JournalEntryType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineDto)
  lines: JournalEntryLineDto[];
}
