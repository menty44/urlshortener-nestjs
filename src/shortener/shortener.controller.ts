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
} from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortenerDto } from './dto/create-shortener.dto';
import { UpdateShortenerDto } from './dto/update-shortener.dto';

import { validate } from 'class-validator';

@Controller('api')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Post()
  create(@Body() createShortenerDto: CreateShortenerDto) {
    return this.shortenerService.create(createShortenerDto);
  }

  @Get()
  findAll() {
    return this.shortenerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shortenerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShortenerDto: UpdateShortenerDto,
  ) {
    return this.shortenerService.update(+id, updateShortenerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shortenerService.remove(+id);
  }

  @Post('encode')
  async encode(@Body() createShortenerDto: CreateShortenerDto) {
    const data = new CreateShortenerDto();
    data.originalUrl = createShortenerDto.originalUrl;

    const errors = await validate(data);

    if (errors.length > 0) {
      console.log('validation failed. errors: ', errors);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: errors,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      console.log('validation succeed');
      return this.shortenerService.encode(createShortenerDto);
    }
  }
}
