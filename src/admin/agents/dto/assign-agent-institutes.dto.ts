import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class AssignAgentInstitutesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  instituteIds: string[];

  @IsOptional()
  @IsBoolean()
  replaceExisting?: boolean;
}
