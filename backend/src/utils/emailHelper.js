import nodemailer from 'nodemailer';

export const sendDynamicEmail = async (options) => {
  const isProd = process.env.ENV === 'prod';

  if (isProd) {
    try {
      console.log('Sending email via Brevo API...');

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'My Wiki',
            email: process.env.EMAIL_FROM,
          },
          to: [
            {
              email: options.email,
            },
          ],
          subject: options.subject,
          textContent: options.text,
          htmlContent: options.html,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('BREVO ERROR:', data);
        throw new Error(data.message || 'Brevo email sending failed');
      }

      console.log('Message sent:', data.messageId);

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
