import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { CaptchaModule } from '../captcha/captcha.module';

@Module({
  imports: [ConfigModule, CaptchaModule],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
