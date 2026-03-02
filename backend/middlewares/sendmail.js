
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true, // Force TLS
  auth: {
            user: "fhiness434@gmail.com",
        pass:"kebxkqksqarawgpg"
  },tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  // Timeout settings
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000,
  socketTimeout: 30000,
});
module.exports = {transport}
