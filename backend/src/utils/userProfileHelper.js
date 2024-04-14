import userModel from '../models/userModel.js';
import { hashPassword } from './authHelper.js';
import { sendDynamicEmail } from './emailHelper.js';
import { authTranslator } from './errorTranslations.js';
import { createEmailTemplate } from './helperFunctions.js';

export const changeUserPasswordFN = async (newPassword, email) => {
  try {
    const hashedPassword = await hashPassword(newPassword);

    const updateUserPassword = await userModel.findOneAndUpdate(
      { email, active: true },
      { password: hashedPassword }
    );

    if (!updateUserPassword) {
      throw new Error(authTranslator.de.message.changePassword);
    }

    // Email versenden

    let htmlTemplate = await createEmailTemplate(
      `${process.env.EMAIL_TEMPLATE_PATH}/changePassword.html`,
      [
        {
          placeholder: '%username%',
          data: updateUserPassword.username,
        },
      ]
    );

    const hasSend = await sendDynamicEmail({
      email: email,
      subject: 'Registration on my-wiki',
      text: htmlTemplate,
      html: htmlTemplate,
    });

    if (!hasSend) {
      throw new Error(authTranslator.de.message.emailSend);
    }

    return {
      status: true,
      code: Number(201),
      responseMessage: 'Das Passwort wurde erfolgreich geändert',
    };
  } catch (error) {
    return {
      status: false,
      code: Number(401),
      responseMessage: error.message,
    };
  }
};

export const changeProfileImage = async (req, res) => {
  //
};
