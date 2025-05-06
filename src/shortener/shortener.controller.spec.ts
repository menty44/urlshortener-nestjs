import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';
import { CreateShortenerDto } from './dto/create-shortener.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ShortenerController', () => {
  let controller: ShortenerController;
  let service: ShortenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenerController],
      providers: [ShortenerService],
    }).compile();

    controller = module.get<ShortenerController>(ShortenerController);
  });

  // Mock data for testing
  const mockShortUrl = 'abc123';
  const mockLongUrl = 'https://website.com';
  const mockStats = {
    longUrl: mockLongUrl,
    visits: 5,
    createdAt: new Date(),
  };
  const mockUrlList = [
    { shortUrl: 'abc123', originalUrl: 'https://testone.com' },
    { shortUrl: 'def456', originalUrl: 'https://testttwo.com' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenerController],
      providers: [
        {
          provide: ShortenerService,
          useValue: {
            encode: jest.fn(),
            decode: jest.fn(),
            listUrls: jest.fn(),
            getStatistics: jest.fn(),
            incrementVisitCount: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ShortenerController>(ShortenerController);
    service = module.get<ShortenerService>(ShortenerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Encode test
  describe('encode', () => {
    it('should encode a URL successfully', async () => {
      const dto = new CreateShortenerDto();
      dto.originalUrl = mockLongUrl;

      const result = { shortUrl: mockShortUrl, originalUrl: mockLongUrl };
      jest.spyOn(service, 'encode').mockResolvedValue(result);

      expect(await controller.encode(dto)).toEqual(result);
      expect(service.encode).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException when validation fails', async () => {
      const dto = new CreateShortenerDto();
      dto.originalUrl = ''; // Invalid URL

      try {
        await controller.encode(dto);
        fail('Should have thrown an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  // List test
  describe('listUrls', () => {
    it('should return a list of URLs', async () => {
      jest.spyOn(service, 'listUrls').mockResolvedValue(mockUrlList);

      const result = await controller.listUrls();
      expect(result).toEqual(mockUrlList);
      expect(service.listUrls).toHaveBeenCalled();
    });
  });
});
