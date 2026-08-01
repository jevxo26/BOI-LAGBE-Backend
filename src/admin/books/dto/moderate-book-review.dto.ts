import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BookReviewStatus } from '../entities';

export class ModerateBookReviewDto {
  @IsEnum(BookReviewStatus)
  @IsNotEmpty()
  status: BookReviewStatus;

  @IsOptional()
  @IsString()
  remark?: string;
}
