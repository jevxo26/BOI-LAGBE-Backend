import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { DocumentVerificationStatus } from '../entities';

export class ListAgentDocumentQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(DocumentVerificationStatus)
  verificationStatus?: DocumentVerificationStatus;
}
