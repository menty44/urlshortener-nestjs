import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';

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
});
