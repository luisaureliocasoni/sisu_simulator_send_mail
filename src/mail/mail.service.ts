import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import sanitizeHtml from 'sanitize-html';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const smtpPort = this.configService.get<number>('smtp.port');

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('smtp.host'),
      port: smtpPort,
      secure: smtpPort === 465, // true for port 465 (SSL/TLS), false for port 587 (STARTTLS)
      requireTLS: true, // Force TLS connection
      auth: {
        user: this.configService.get<string>('smtp.auth.user'),
        pass: this.configService.get<string>('smtp.auth.pass'),
      },
      tls: {
        ciphers: 'SSLv3',
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
