import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateShortenerDto {
  @IsUrl(undefined, { message: 'originalUrl must be a valid URL' })
  @IsNotEmpty({ message: 'originalUrl is required' })
  @IsString()
  originalUrl: string;
}
