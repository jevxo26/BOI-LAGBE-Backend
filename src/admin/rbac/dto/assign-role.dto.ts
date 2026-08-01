import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class AssignRoleDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  roleIds: string[];

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
