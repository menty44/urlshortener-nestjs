import { Injectable } from '@nestjs/common';
import { CreateShortenerDto } from './dto/create-shortener.dto';
import { randomBytes } from 'crypto';

interface TempData {
  originalUrl: string;
  visits: number;
  createdAt: Date;
}

@Injectable()
export class ShortenerService {
  // Maximum SHORT_URL_LENGTH
  SHORT_URL_LENGTH = 7;
  // Maximum URL length
  MAX_URL_LENGTH = 2048;
  private urlMap: {
    [shortUrl: string]: TempData;
  } = {};

  /**
   * Generates a random short URL.
   * @returns The short URL.
   */
  private generateShortUrl(): string {
    return randomBytes(Math.ceil(this.SHORT_URL_LENGTH / 2))
      .toString('hex')
      .slice(0, this.SHORT_URL_LENGTH);
  }

  // Encode and savee data in the memory
  async encode(createShortenerDto: CreateShortenerDto): Promise<any> {
    // Check if the long URL already exists
    const existingShortUrl = Object.keys(this.urlMap).find(
      (shortUrl) =>
        this.urlMap[shortUrl].originalUrl === createShortenerDto.originalUrl,
    );
    if (existingShortUrl) {
      return existingShortUrl; // Return the existing short URL
    }

    // Generate a unique short URL
    let shortUrl: string;
    let attempt = 0;
    do {
      if (attempt > 10) {
        throw new Error('Failed to generate unique short URL');
      }
      shortUrl = this.generateShortUrl();
      if (!this.urlMap[shortUrl]) {
        break; // Exit loop if short URL is unique
      }
      attempt++;
    } while (true);

    // Create and save the new URL mapping
    this.urlMap[shortUrl] = {
      originalUrl: createShortenerDto.originalUrl,
      visits: 0,
      createdAt: new Date(),
    };
    return shortUrl;
  }

  // list saved data
  async listUrls(): Promise<{ shortUrl: string; originalUrl: string }[]> {
    return Object.entries(this.urlMap).map(([shortUrl, { originalUrl }]) => ({
      shortUrl,
      originalUrl,
    }));
  }

  // Decoding function
  async decode(shortUrl: string): Promise<string | undefined> {
    return this.urlMap[shortUrl]?.originalUrl;
  }

  // incease counts
  async incrementVisitCount(shortUrl: string): Promise<void> {
    if (this.urlMap[shortUrl]) {
      this.urlMap[shortUrl].visits += 1;
    }
  }

  // Stats function
  async getStatistics(
    shortUrl: string,
  ): Promise<{ longUrl: string; visits: number; createdAt: Date } | null> {
    return this.urlMap[shortUrl]
      ? {
          longUrl: this.urlMap[shortUrl].originalUrl,
          visits: this.urlMap[shortUrl].visits,
          createdAt: this.urlMap[shortUrl].createdAt,
        }
      : null;
  }
}
