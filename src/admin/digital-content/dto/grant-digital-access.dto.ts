import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { DigitalAccessType } from '../entities';

export class GrantDigitalAccessDto {
  @IsUUID()
  userId: string;

  @IsEnum(DigitalAccessType)
  accessType: DigitalAccessType;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
