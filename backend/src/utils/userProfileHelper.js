import userModel from '../models/userModel.js';
import { hashPassword } from './authHelper.js';
import { sendDynamicEmail } from './emailHelper.js';
import { authTranslator } from './errorTranslations.js';
import { createEmailTemplate } from './helperFunctions.js';
import path from 'path';
import slugify from 'slugify';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const templatePath = path.join(__dirname, 'templates', 'changePassword.html');
    let htmlTemplate = await createEmailTemplate(templatePath, [
      {
        placeholder: '%username%',
        data: updateUserPassword.username,
      },
    ]);

    const hasSend = await sendDynamicEmail({
      email: email,
      subject: 'Password changed on my-wiki',
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

export const updateUserFN = async (searchParam, dataParam) => {
  try {
    const updateUser = await userModel.findOneAndUpdate(searchParam, dataParam);

    if (!updateUser) {
      throw new Error(authTranslator.de.message.changeGeneral);
    }

    return {
      status: true,
      code: Number(201),
      oldData: updateUser,
    };
  } catch (error) {
    return {
      status: false,
      code: 401,
      responseMessage: error.message,
    };
  }
  //
};

export const getOrCreateCloudPath = async (email) => {
  const user = await userModel.findOne({ email }).select({ 'profileImage.cloudPath': 1 }).exec();

  if (user?.profileImage?.cloudPath) {
    return user.profileImage.cloudPath;
  }

  const cleanEmailName = generateUniqueCloudPath(email);

  return `${process.env.FILEPATH}/${cleanEmailName}`;
};

export const getMyProfileDataFN = async (email) => {
  try {
    const user = await userModel
      .findOne({ email })
      .select(
        'firstName lastName username description location createdAt updatedAt provider profileImage twoFactorAuth notifyOnNewArticles emailNotifyOnNewArticles allowMessages isProfilePrivate'
      );

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
};

const generateUniqueCloudPath = (email) => {
  const cleanEmail = slugify(email.split('@')[0], { lower: true });
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 100000);
  return `${cleanEmail}_${timestamp}_${randomSuffix}`;
};
