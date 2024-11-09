import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { config } from '../config/index';

let transporter: Transporter;

async function setupMailer(): Promise<void> {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
}

async function sendOTP(email: string, otp: string): Promise<void> {
  console.log('sendotp working now')
  if (!transporter) {
    await setupMailer();
  }

  const mailOptions: SendMailOptions = {
    from: config.email.user,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

export { sendOTP };