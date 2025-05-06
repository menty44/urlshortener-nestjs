import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  HttpCode,
  Param,
  Redirect,
} from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortenerDto } from './dto/create-shortener.dto';

import { validate } from 'class-validator';

@Controller('api')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Post('encode')
  async encode(@Body() createShortenerDto: CreateShortenerDto): Promise<any> {
    const data = new CreateShortenerDto();
    data.originalUrl = createShortenerDto.originalUrl;

    const errors = await validate(data);

    if (errors.length > 0) {
      Logger.debug('validation failed. errors: ', errors);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: errors,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      Logger.debug('validation succeed');
      return this.shortenerService.encode(createShortenerDto);
    }
  }

  @Get('list')
  async listUrls(): Promise<{ shortUrl: string; originalUrl: string }[]> {
    return this.shortenerService.listUrls();
  }

  @Post('decode')
  @HttpCode(HttpStatus.OK)
  async decode(
    @Body() shortenerDto: { shortUrl: string },
  ): Promise<{ longUrl: string } | { status: any; message: string }> {
    const longUrl = await this.shortenerService.decode(shortenerDto.shortUrl);
    if (!longUrl) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Short URL not found',
      });
    }
    return { longUrl };
  }

  @Get('statistic/:shortUrl')
  async getStatistics(
    @Param('shortUrl') shortUrl: string,
  ): Promise<{ longUrl: string; visits: number; createdAt: Date }> {
    if (!shortUrl) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Short URL parameter not found',
      });
    }

    const stats = await this.shortenerService.getStatistics(shortUrl);
    if (!stats) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Short URL not found',
      });
    }
    return stats;
  }

  @Get(':shortUrl')
  @Redirect('', HttpStatus.FOUND)
  async redirectToLongUrl(@Param('shortUrl') shortUrl: string): Promise<any> {
    const longUrl = await this.shortenerService.decode(shortUrl);
    if (!longUrl) {
      throw new NotFoundException('Short URL not found');
    }
    await this.shortenerService.incrementVisitCount(shortUrl);
    return { url: longUrl };
  }
}
