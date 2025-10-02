import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as svgCaptcha from 'svg-captcha';
import { randomBytes } from 'crypto';

@Injectable()
export class CaptchaService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async generateCaptcha(): Promise<{ token: string; svg: string }> {
    const captcha = svgCaptcha.create({
      size: 6,
      noise: 2,
      color: true,
      background: '#f0f0f0',
    });

    const token = randomBytes(32).toString('hex');

    // Store captcha text in cache with 5 minutes TTL
    await this.cacheManager.set(
      `captcha:${token}`,
      captcha.text.toLowerCase(),
      300000, // 5 minutes
    );

    return {
      token,
      svg: captcha.data,
    };
  }

  async verifyCaptcha(token: string, answer: string): Promise<boolean> {
    const storedAnswer = await this.cacheManager.get<string>(
      `captcha:${token}`,
    );

    if (!storedAnswer) {
      return false; // Token expired or invalid
    }

    // Delete token after verification (one-time use)
    await this.cacheManager.del(`captcha:${token}`);

    return storedAnswer === answer.toLowerCase();
  }
}
