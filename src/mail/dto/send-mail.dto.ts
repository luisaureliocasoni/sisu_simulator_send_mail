import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SendMailDto {
  @ApiProperty({
    description: 'Name of the sender',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the sender (will be used as reply-to)',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Message content (plain text only)',
    example: 'Hello, I would like to know more about...',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'CAPTCHA token received from GET /captcha',
    example: 'a1b2c3d4e5f6...',
  })
  @IsString()
  @IsNotEmpty()
  captchaToken: string;

  @ApiProperty({
    description: 'CAPTCHA answer provided by user',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  captchaAnswer: string;
}
