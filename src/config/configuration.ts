export default () => ({
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  mail: {
    toDestination: process.env.MAIL_TO_DESTINATION,
    senderName: process.env.SENDER_NAME || 'SISU Simulator Contact Form',
  },
});
