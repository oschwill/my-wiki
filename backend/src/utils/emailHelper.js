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
    secure: Number(process.env.EMAIL_PORT) === 465,
    ...(isProd && {
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    }),
  });

  try {
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

  console.log('Message sent: %s', info.messageId);

  return true;
};
