import { IsEnum, IsNotEmpty } from 'class-validator';
import { RiderStatus } from '../entities';

export class UpdateRiderStatusDto {
  @IsEnum(RiderStatus)
  @IsNotEmpty()
  status: RiderStatus;
}
