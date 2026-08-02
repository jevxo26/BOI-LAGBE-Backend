import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { DocumentVerificationStatus } from '../../agents/entities';

export class ListRiderDocumentQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(DocumentVerificationStatus)
  verificationStatus?: DocumentVerificationStatus;
}
