import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { CaptchaService } from '../captcha/captcha.service';
import { SendMailDto } from './dto/send-mail.dto';

@ApiTags('mail')
@Controller('send-mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send an email via SMTP' })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Email sent successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid CAPTCHA or validation error',
  })
  async sendMail(@Body() sendMailDto: SendMailDto) {
    // Verify CAPTCHA first
    const isCaptchaValid = await this.captchaService.verifyCaptcha(
      sendMailDto.captchaToken,
      sendMailDto.captchaAnswer,
    );

    if (!isCaptchaValid) {
      throw new BadRequestException('Invalid CAPTCHA');
    }

    // Send email
    await this.mailService.sendMail(sendMailDto);

    return { message: 'Email sent successfully' };
  }
}
