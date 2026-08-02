import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SystemSettingGroup } from '../entities';

export class UpdateSystemSettingDto {
  @IsOptional()
  @IsString()
  settingValue?: string;

  @IsOptional()
  @IsEnum(SystemSettingGroup)
  group?: SystemSettingGroup;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isSecret?: boolean;
}
