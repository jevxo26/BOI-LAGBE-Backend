import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class PublishItemDto {
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
