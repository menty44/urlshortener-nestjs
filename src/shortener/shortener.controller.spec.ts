import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';
import { CreateShortenerDto } from './dto/create-shortener.dto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

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

  // Decodee test
  describe('decode', () => {
    it('should decode a short URL successfully', async () => {
      jest.spyOn(service, 'decode').mockResolvedValue(mockLongUrl);

      const result = await controller.decode({ shortUrl: mockShortUrl });
      expect(result).toEqual({ longUrl: mockLongUrl });
      expect(service.decode).toHaveBeenCalledWith(mockShortUrl);
    });

    it('should throw NotFoundException when short URL is not found', async () => {
      jest.spyOn(service, 'decode').mockResolvedValue(null);

      try {
        await controller.decode({ shortUrl: 'nonexistent' });
        fail('Should have thrown an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  // stats test
  describe('getStatistics', () => {
    it('should return statistics for a short URL', async () => {
      jest.spyOn(service, 'getStatistics').mockResolvedValue(mockStats);

      const result = await controller.getStatistics(mockShortUrl);
      expect(result).toEqual(mockStats);
      expect(service.getStatistics).toHaveBeenCalledWith(mockShortUrl);
    });

    it('should throw NotFoundException when short URL is not found', async () => {
      jest.spyOn(service, 'getStatistics').mockResolvedValue(null);

      try {
        await controller.getStatistics('nonexistent');
        fail('Should have thrown an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw NotFoundException when shortUrl parameter is empty', async () => {
      try {
        await controller.getStatistics('');
        fail('Should have thrown an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  // redirect test
  describe('redirectToLongUrl', () => {
    it('should redirect to the long URL and increment visit count', async () => {
      jest.spyOn(service, 'decode').mockResolvedValue(mockLongUrl);
      jest.spyOn(service, 'incrementVisitCount').mockResolvedValue(undefined);

      const result = await controller.redirectToLongUrl(mockShortUrl);
      expect(result).toEqual({ url: mockLongUrl });
      expect(service.decode).toHaveBeenCalledWith(mockShortUrl);
      expect(service.incrementVisitCount).toHaveBeenCalledWith(mockShortUrl);
    });

    it('should throw NotFoundException when short URL is not found', async () => {
      jest.spyOn(service, 'decode').mockResolvedValue(null);

      try {
        await controller.redirectToLongUrl('nonexistent');
        fail('Should have thrown an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
