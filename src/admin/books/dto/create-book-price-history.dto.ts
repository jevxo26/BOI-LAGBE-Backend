import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookPriceHistoryDto {
  // New price for the book; the current book price is captured as oldPrice
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
