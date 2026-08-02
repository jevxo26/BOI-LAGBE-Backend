import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';
import { ProofType } from '../entities';

export class ListRiderProofQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(ProofType)
  proofType?: ProofType;
}
