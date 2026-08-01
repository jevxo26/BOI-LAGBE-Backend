import { IsBoolean } from 'class-validator';

export class PublishDigitalContentDto {
  @IsBoolean()
  published: boolean;
}
