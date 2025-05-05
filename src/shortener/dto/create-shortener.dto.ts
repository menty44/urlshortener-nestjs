import { IsString } from 'class-validator';

export class CreateShortenerDto {
  @IsString()
  originalUrl: string;
}
