import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';

@Injectable()
export class CaptchaService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async generateCaptcha(): Promise<{ token: string; svg: string }> {
    // Generate two random single-digit numbers
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);

    // Randomly choose operation
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let answer: number;
    let displayNum1 = num1;
    let displayNum2 = num2;

    // Calculate answer based on operation
    switch (operation) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        // Ensure result is not negative
        if (num1 >= num2) {
          answer = num1 - num2;
        } else {
          displayNum1 = num2;
          displayNum2 = num1;
          answer = num2 - num1;
        }
        break;
      case '×':
        answer = num1 * num2;
        break;
      default:
        answer = num1 + num2;
    }

    // Create math expression
    const mathExpression = `${displayNum1} ${operation} ${displayNum2} = ?`;

    // Create simple SVG with the math expression
    const svg = this.createMathSvg(mathExpression);

    const token = randomBytes(32).toString('hex');

    // Store numeric answer in cache with 5 minutes TTL
    await this.cacheManager.set(
      `captcha:${token}`,
      answer.toString(),
      300000, // 5 minutes
    );

    //console.log(mathExpression);
    //console.log(answer);

    return {
      token,
      svg,
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

    // Compare numeric values (trim whitespace)
    return storedAnswer === answer.trim();
  }

  private createMathSvg(expression: string): string {
    // Generate random colors for variety
    const colors = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Add slight random rotation to each character for a more "captcha-like" look
    const chars = expression.split('');
    const charElements = chars
      .map((char, index) => {
        const x = 30 + index * 28;
        const rotation = (Math.random() - 0.5) * 10; // -5 to +5 degrees
        return `<text x="${x}" y="45" transform="rotate(${rotation}, ${x}, 45)" fill="${color}" font-size="32" font-weight="bold" font-family="Arial, sans-serif">${char}</text>`;
      })
      .join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="70" viewBox="0 0 250 70">
      <rect width="250" height="70" fill="#f0f0f0"/>
      <g>${charElements}</g>
    </svg>`;
  }
}
