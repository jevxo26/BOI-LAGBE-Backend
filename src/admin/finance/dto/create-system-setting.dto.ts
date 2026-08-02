import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SystemSettingGroup } from '../entities';

export class CreateSystemSettingDto {
  @IsString()
  settingKey: string;

  @IsString()
  settingValue: string;

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
