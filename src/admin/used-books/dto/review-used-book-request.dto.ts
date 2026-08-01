import { IsEnum, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { UsedBookSellRequestStatus } from '../entities';

export class ReviewUsedBookRequestDto {
  @IsEnum(UsedBookSellRequestStatus)
  @IsIn([
    UsedBookSellRequestStatus.ACCEPTED,
    UsedBookSellRequestStatus.REJECTED,
  ])
  status: UsedBookSellRequestStatus;

  @IsOptional()
  @IsUUID()
  rejectReasonId?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
