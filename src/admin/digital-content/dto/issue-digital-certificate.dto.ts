import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class IssueDigitalCertificateDto {
  @IsOptional()
  @IsUUID()
  examId?: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
