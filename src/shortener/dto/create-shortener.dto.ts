import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateShortenerDto {
  @IsUrl(undefined, { message: 'longUrl must be a valid URL' })
  @IsNotEmpty({ message: 'longUrl is required' })
  @IsString()
  originalUrl: string;
}
