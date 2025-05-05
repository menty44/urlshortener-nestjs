import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class DecodeShortenerDto {
  @IsNotEmpty({ message: 'shortUrl is required' })
  @IsString()
  shortUrl: string;
}
