import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PublishProductDto {
  // true = publish (ACTIVE + publishedAt), false = unpublish back to DRAFT
  @IsBoolean()
  @IsNotEmpty()
  published: boolean;
}
