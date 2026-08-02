import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class ReplyToTicketDto {
  @IsString()
  @MinLength(1)
  message: string;

  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}
