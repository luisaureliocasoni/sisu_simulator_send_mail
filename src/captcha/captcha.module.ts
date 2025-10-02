import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [CaptchaController],
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
