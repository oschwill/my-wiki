import nodemailer from 'nodemailer';

export const sendDynamicEmail = async (options) => {
  const isProd = process.env.ENV === 'prod';

  console.log('EMAIL CONFIG:', {
    env: process.env.ENV,
    isProd,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    hasPassword: !!process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    ...(isProd && {
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    }),
  });

  try {
    console.log('Trying to send email...');

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
