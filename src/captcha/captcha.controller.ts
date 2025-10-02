import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CaptchaService } from './captcha.service';
import { VerifyCaptchaDto } from './dto/verify-captcha.dto';

@ApiTags('captcha')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get()
  @ApiOperation({ summary: 'Generate a new math CAPTCHA (e.g., "3 + 5 = ?")' })
  @ApiResponse({
    status: 200,
    description: 'Math CAPTCHA generated successfully',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'Unique token for this CAPTCHA (expires in 5 minutes)',
          example: 'a1b2c3d4e5f6789...',
        },
        svg: {
          type: 'string',
          description: 'SVG image displaying a math operation with two single-digit numbers',
          example: '<svg xmlns="http://www.w3.org/2000/svg" width="250" height="70">...</svg>',
        },
      },
    },
  })
  async generateCaptcha() {
    return this.captchaService.generateCaptcha();
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a CAPTCHA answer' })
  @ApiResponse({
    status: 200,
    description: 'CAPTCHA verification result',
    schema: {
      type: 'object',
      properties: {
        valid: {
          type: 'boolean',
          description: 'Whether the CAPTCHA answer is correct',
        },
      },
    },
  })
  async verifyCaptcha(@Body() verifyCaptchaDto: VerifyCaptchaDto) {
    const valid = await this.captchaService.verifyCaptcha(
      verifyCaptchaDto.token,
      verifyCaptchaDto.answer,
    );

    return { valid };
  }
}
