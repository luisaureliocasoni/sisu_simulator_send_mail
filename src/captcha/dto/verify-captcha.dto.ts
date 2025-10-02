import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyCaptchaDto {
  @ApiProperty({
    description: 'CAPTCHA token received from GET /captcha',
    example: 'a1b2c3d4e5f6...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'CAPTCHA answer provided by user',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;
}
