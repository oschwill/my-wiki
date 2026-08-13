import nodemailer from 'nodemailer';

export const sendDynamicEmail = async (options) => {
  const isProd = process.env.ENV === 'prod';

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `My Wiki <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.text, // plain text body
    html: options.html, // html body
  });

  console.log('Message sent: %s', info.messageId);

  return true;
};
