import { IsEnum, IsNotEmpty } from 'class-validator';
import { DocumentVerificationStatus } from '../entities';

export class VerifyAgentDocumentDto {
  @IsEnum(DocumentVerificationStatus)
  @IsNotEmpty()
  verificationStatus: DocumentVerificationStatus;
}
