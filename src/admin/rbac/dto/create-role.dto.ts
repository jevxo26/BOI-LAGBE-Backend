import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { RoleStatus } from '../entities';

export class CreateRoleDto {
  // Normalize to UPPER_SNAKE so grants are deterministic: the AdminRoleGuard
  // matches exact strings ('ADMIN', 'SUPER_ADMIN'). A role created as 'admin'
  // (lowercase) would otherwise silently fail to grant admin access.
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z][A-Z0-9_]*$/, {
    message: 'name must be UPPER_SNAKE_CASE (letters, digits, underscores)',
  })
  name: string;

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
