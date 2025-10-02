<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Send Mail API - A secure email service built with NestJS 10 that provides:
- SMTP email sending with TLS encryption
- Self-hosted math CAPTCHA protection (simple arithmetic with single-digit numbers)
- Input sanitization for security
- CORS protection for localhost and *.sisusimulator.com.br
- Swagger API documentation at `/docs`

## Project setup

```bash
$ npm install
```

## Configuration

1. Copy the example environment file:
```bash
$ cp .env.example .env
```

2. Edit `.env` and configure your SMTP settings:
```
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587              # Use 587 for STARTTLS or 465 for SSL/TLS
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
MAIL_TO_DESTINATION=recipient@example.com
SENDER_NAME=SISU Simulator Contact Form
PORT=3000
```

### SMTP Port Configuration
- **Port 587**: STARTTLS (recommended) - starts unencrypted, upgrades to TLS
- **Port 465**: SSL/TLS - encrypted from the start
- The application automatically detects the port and configures encryption accordingly

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

Once the application is running, visit `http://localhost:3000/docs` to see the interactive Swagger documentation.

## API Endpoints

### 1. Generate CAPTCHA
```
GET /captcha
```
Returns a math CAPTCHA challenge (e.g., "3 + 5 = ?") with a token and SVG image.

**Response:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"250\" height=\"70\">...</svg>"
}
```

The SVG displays a simple math operation with two single-digit numbers using one of these operations:
- Addition (+)
- Subtraction (-)
- Multiplication (×)

### 2. Send Email
```
POST /send-mail
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here",
  "captchaToken": "token-from-captcha-endpoint",
  "captchaAnswer": "8"
}
```

**Note:** The `captchaAnswer` should be the numeric result of the math operation shown in the CAPTCHA image.

**Response:**
```json
{
  "message": "Email sent successfully"
}
```

## Security Features

- **Math CAPTCHA Protection**: Self-hosted arithmetic CAPTCHA with 5-minute expiration and one-time use tokens. Users must solve simple math problems (e.g., "7 + 3 = ?") with single-digit numbers.
- **Input Sanitization**: All message content is sanitized to prevent XSS attacks
- **CORS Protection**: Only allows requests from localhost and *.sisusimulator.com.br
- **TLS Encryption**: SMTP connection with STARTTLS (port 587) or SSL/TLS (port 465) support
  - Automatically configures `secure` mode based on port
  - Forces TLS with `requireTLS: true`
  - SSLv3 cipher configuration
- **Validation**: Strong DTO validation with class-validator

## Troubleshooting

### SMTP Authentication Errors

If you receive `535 5.7.8 Error: authentication failed`, try these solutions:

1. **Check credentials**: Verify `SMTP_USER` and `SMTP_PASSWORD` are correct

2. **Use app-specific password**: Many providers (Gmail, Outlook) require app-specific passwords instead of your account password
   - Gmail: https://myaccount.google.com/apppasswords
   - Outlook: Account settings → Security → App passwords

3. **Enable "Less secure apps"** (if using legacy Gmail):
   - Not recommended, use app-specific passwords instead

4. **Try different port**:
   - Change `SMTP_PORT=587` to `SMTP_PORT=465`
   - Or vice versa

5. **Check SMTP host**: Ensure `SMTP_HOST` is correct
   - Gmail: `smtp.gmail.com`
   - Outlook: `smtp-mail.outlook.com` or `smtp.office365.com`
   - Yahoo: `smtp.mail.yahoo.com`

6. **Firewall/Network**: Ensure ports 587 or 465 are not blocked

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
