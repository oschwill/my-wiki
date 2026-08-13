import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export const sendDynamicEmail = async (options) => {
  const isProd = process.env.ENV === 'prod';

  if (isProd) {
    const resend = new Resend(process.env.EMAIL_PASSWORD);

    try {
      console.log('Sending email via Resend API...');

      const { data, error } = await resend.emails.send({
        from: `My Wiki <${process.env.EMAIL_FROM}>`,
        to: [options.email],
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      if (error) {
        console.error('RESEND ERROR:', error);
        throw error;
      }

      console.log('Message sent:', data?.id);

      return true;
    } catch (error) {
      console.error('EMAIL ERROR:', error);
      throw error;
    }
  }

  // Local development → Mailcatcher
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
  });

  try {
    console.log('Sending email via Mailcatcher...');

    const info = await transporter.sendMail({
      from: `My Wiki <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Message sent:', info.messageId);

    return true;
  } catch (error) {
    console.error('EMAIL ERROR:', error);
    throw error;
  }
};
