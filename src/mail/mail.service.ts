import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import sanitizeHtml from 'sanitize-html';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('smtp.host'),
      port: this.configService.get<number>('smtp.port'),
      secure: false, // TLS
      auth: {
        user: this.configService.get<string>('smtp.auth.user'),
        pass: this.configService.get<string>('smtp.auth.pass'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(sendMailDto: SendMailDto): Promise<void> {
    // Sanitize message to plain text only (remove any HTML/scripts)
    const sanitizedMessage = sanitizeHtml(sendMailDto.message, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const mailOptions = {
      from: `"${this.configService.get<string>('mail.senderName')}" <${this.configService.get<string>('smtp.auth.user')}>`,
      to: this.configService.get<string>('mail.toDestination'),
      replyTo: sendMailDto.email,
      subject: `Contact Form: ${sendMailDto.name}`,
      text: `
Name: ${sendMailDto.name}
Email: ${sendMailDto.email}

Message:
${sanitizedMessage}
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
