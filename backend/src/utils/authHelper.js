import bcrypt from 'bcrypt';
import xss from 'xss';
import userModel from '../models/userModel.js';
import { sendDynamicEmail } from './emailHelper.js';
import { authTranslator } from './errorTranslations.js';
import { createEmailTemplate } from './helperFunctions.js';
import { createCookie, createToken } from '../middleware/token.js';

export const registerHelperFN = async (data, fileData) => {
  // erzeugen ein Email Token
  const emailVerifyToken = Math.random().toString().slice(2, 8);
  // hashen datt Password
  const hashedPassword = await hashPassword(data.password);

  try {
    // Datenbank Eintrag
    const newUser = new userModel({
      firstName: data.firstName,
      lastName: data.lastName,
      description: data.description,
      location: data.location,
      password: hashedPassword,
      email: data.email,
      emailVerifyCode: emailVerifyToken,
      profileImage: fileData,
      ipAddress: data.ipAddress,
    });

    const entry = await newUser.save();

    if (!entry) {
      throw new Error(authTranslator.de.message.general);
    }

    // Email versenden
    let htmlTemplate = await createEmailTemplate(
      `${process.env.EMAIL_TEMPLATE_PATH}/verifyRegister.html`,
      [
        {
          placeholder: '%username%',
          data: entry.username,
        },
        {
          placeholder: '%token%',
          data: entry.emailVerifyCode,
        },
      ]
    );

    const hasSend = await sendDynamicEmail({
      email: entry.email,
      subject: 'Registration on my-wiki',
      text: htmlTemplate,
      html: htmlTemplate,
    });

    if (!hasSend) {
      throw new Error(authTranslator.de.message.emailSend);
    }

    return {
      status: true,
      message:
        'Die Registrierung war erfolgreich, bitte checken Sie Ihre Email und geben sie das Token ein um die Registrierung abzuschließen',
    };
  } catch (error) {
    // Abfragen nach den gängigsten mongoose Errormeldung um eine custom Message für zu returnen
    if (error?.code === 11000) {
      return {
        status: false,
        message: authTranslator.de.message.general,
      };
    } else if (error.name === 'ValidationError') {
      return {
        status: false,
        message: authTranslator.de.message.validate,
      };
    } else {
      return {
        status: false,
        message: error.message,
      };
    }
  }
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const getEmailVerifyCode = async (check) => {
  try {
    console.log(check);
    const hasEmailVerifyToken = await userModel.findOne(check, { emailVerifyCode: 1, _id: 0 });

    if (!hasEmailVerifyToken) {
      throw new Error(authTranslator.de.message.noToken);
    }

    return {
      status: true,
    };
  } catch (error) {
    if (error.name === 'ReferenceError') {
      return {
        status: false,
        code: Number(404),
        responseMessage: authTranslator.de.message.noToken,
      };
    } else {
      return {
        status: false,
        code: Number(404),
        responseMessage: error.message,
      };
    }
  }
};

export const updateUserStatus = async (email) => {
  try {
    const update = {
      emailVerifyCode: null,
      active: true,
    };

    const updateUserStatus = await userModel.findOneAndUpdate({ email }, update);

    if (!updateUserStatus) {
      throw new Error(authTranslator.de.message.noActive);
    }

    return {
      status: true,
      code: Number(201),
      responseMessage: 'Sie wurden erfolgreich registriert, Sie können sie nun anmelden',
    };
  } catch (error) {
    return {
      status: false,
      code: Number(401),
      responseMessage: error.message,
    };
  }
};

export const resendEmailTokenFN = async (email) => {
  const emailVerifyCode = Math.random().toString().slice(2, 8);

  try {
    const updateUserStatus = await userModel.findOneAndUpdate(
      { email },
      { emailVerifyCode },
      { new: true } // gibt mir den aktualisierten Datensatz zurück
    );

    if (!updateUserStatus) {
      throw new Error(authTranslator.de.message.general);
    }

    // Email versenden
    let htmlTemplate = await createEmailTemplate(
      `${process.env.EMAIL_TEMPLATE_PATH}/verifyRegister.html`,
      [
        {
          placeholder: '%username%',
          data: updateUserStatus.username,
        },
        {
          placeholder: '%token%',
          data: updateUserStatus.emailVerifyCode,
        },
      ]
    );

    const hasSend = await sendDynamicEmail({
      email: updateUserStatus.email,
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
      responseMessage: 'Ihr neues Token wurde an Ihre Email versendet',
    };
  } catch (error) {
    return {
      status: false,
      code: Number(401),
      responseMessage: error.message,
    };
  }
};

export const getUserData = async (email) => {
  email = xss(email);

  try {
    const user = await userModel.findOne({ email, active: true }).exec();

    if (!user) {
      throw new Error(authTranslator.de.message.noAuth);
    }

    const userAuthData = {
      userId: user._id,
      email: user.email,
      role: user.role,
      password: user.password,
    };

    return {
      status: true,
      code: Number(200),
      data: userAuthData,
    };
  } catch (error) {
    return {
      status: false,
      code: Number(401),
      responseMessage: error.message,
    };
  }
};

export const checkPassword = async (userData, password, res, login = true) => {
  try {
    if (await bcrypt.compare(password, userData.password)) {
      if (!login) {
        return {
          status: true,
        };
      }

      const hasToken = createAuth(userData, res);

      if (!hasToken) {
        throw new Error(authTranslator.de.message.noAuth);
      }

      return {
        status: true,
        code: Number(200),
        responseMessage: 'Login erfolgreich',
      };
    } else {
      if (!login) {
        throw new Error(authTranslator.de.message.changePassword);
      }

      throw new Error(authTranslator.de.message.noAuth);
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      code: Number(401),
      responseMessage: error.message,
    };
  }
};

export const createAuth = (userData, res) => {
  const authToken = createToken(userData);

  if (!authToken) {
    return false;
  }

  createCookie(authToken, res);
  return true;
};
