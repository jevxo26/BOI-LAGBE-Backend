import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class AssignAgentAreasDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  areaIds: string[];

  // The area marked primary; if omitted, the first area is made primary
  @IsOptional()
  @IsUUID()
  primaryAreaId?: string;

  @IsOptional()
  @IsBoolean()
  replaceExisting?: boolean;
}
