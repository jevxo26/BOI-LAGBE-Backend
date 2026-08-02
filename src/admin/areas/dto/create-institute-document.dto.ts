import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInstituteDocumentDto {
  @IsString()
  @IsNotEmpty()
  documentName: string;

  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
