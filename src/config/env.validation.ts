import { plainToClass } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumberString,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  SMTP_HOST: string;

  @IsNumberString()
  @IsNotEmpty()
  SMTP_PORT: string;

  @IsString()
  @IsNotEmpty()
  SMTP_USER: string;

  @IsString()
  @IsNotEmpty()
  SMTP_PASSWORD: string;

  @IsEmail()
  @IsNotEmpty()
  MAIL_TO_DESTINATION: string;

  @IsString()
  @IsNotEmpty()
  SENDER_NAME: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
