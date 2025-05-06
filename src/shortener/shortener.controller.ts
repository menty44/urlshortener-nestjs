import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortenerDto } from './dto/create-shortener.dto';
import { UpdateShortenerDto } from './dto/update-shortener.dto';

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
}
