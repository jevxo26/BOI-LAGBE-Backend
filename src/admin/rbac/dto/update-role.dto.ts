import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { RoleStatus } from '../entities';

export class UpdateRoleDto {
  // Same normalization as CreateRoleDto — keeps role names UPPER_SNAKE so
  // role grants always match the AdminRoleGuard's exact-string check.
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @IsOptional()
  @MinLength(1)
  @Matches(/^[A-Z][A-Z0-9_]*$/, {
    message: 'name must be UPPER_SNAKE_CASE (letters, digits, underscores)',
  })
  name?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isSystemRole?: boolean;

  @IsOptional()
  @IsEnum(RoleStatus)
  status?: RoleStatus;
}
