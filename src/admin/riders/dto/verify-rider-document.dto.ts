import { IsEnum, IsNotEmpty } from 'class-validator';
import { DocumentVerificationStatus } from '../../agents/entities';

export class VerifyRiderDocumentDto {
  @IsEnum(DocumentVerificationStatus)
  @IsNotEmpty()
  verificationStatus: DocumentVerificationStatus;
}
