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
    description:
      'CAPTCHA answer provided by user (numeric result of the math operation)',
    example: '8',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;
}
