import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../../auth/entities';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;
}
