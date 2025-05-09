import bcrypt from 'bcryptjs';
import xss from 'xss';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import userModel from '../models/userModel.js';
import { sendDynamicEmail } from './emailHelper.js';
import { authTranslator } from './errorTranslations.js';
import { createEmailTemplate } from './helperFunctions.js';
import { createCookie, createToken } from '../middleware/token.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registerHelperFN = async (data) => {
  // erzeugen ein Email Token
  const emailVerifyToken = Math.random().toString().slice(2, 8);
  // hashen datt Password
  const hashedPassword = await hashPassword(data.password);

  try {
    // Datenbank Eintrag
    const newUser = new userModel({
      provider: null,
      firstName: data.firstName,
      lastName: data.lastName,
      description: data.description,
      location: data.location,
      password: hashedPassword,
      email: data.email,
      emailVerifyCode: emailVerifyToken,
      profileImage: null,
      ipAddress: data.ipAddress,
    });

    const entry = await newUser.save();

    if (!entry) {
      throw new Error(authTranslator.de.message.general);
    }

    // Template Path holen
    const templatePath = path.join(__dirname, 'templates', 'verifyRegister.html');

    // Email versenden
    let htmlTemplate = await createEmailTemplate(templatePath, [
      {
        placeholder: '%username%',
        data: entry.username,
      },
      {
        placeholder: '%token%',
        data: `${process.env.FRONTEND_URL}/verify-user?email=${entry.email}&token=${entry.emailVerifyCode}`,
      },
    ]);

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
      responseMessage: 'Sie wurden erfolgreich registriert, Sie werden weitergeleitet in ',
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
  const loginVerifyToken = generateLoginVerifyToken();

  try {
    const userData = await saveLoginVerifyToken(email, loginVerifyToken);

    if (!userData) {
      throw new Error(authTranslator.de.message.general);
    }

    // Email versenden
    const templatePath = path.join(__dirname, 'templates', 'twoFactorAuthToken.html');
    let htmlTemplate = await createEmailTemplate(templatePath, [
      {
        placeholder: '%username%',
        data: userData.username,
      },
      {
        placeholder: '%token%',
        data: userData.loginVerifyToken,
      },
    ]);

    const hasSend = await sendDynamicEmail({
      email: userData.email,
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
      twoFactorAuth: user.twoFactorAuth,
      password: user.password,
      profileImage: user.profileImage,
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

export const checkPassword = async (userData, password, loginStay, res, login = true) => {
  try {
    if (await bcrypt.compare(password, userData.password)) {
      if (!login) {
        return {
          status: true,
        };
      }

      // checken auf 2fa
      if (userData.twoFactorAuth) {
        const loginVerifyToken = generateLoginVerifyToken();
        await saveLoginVerifyToken(userData.email, loginVerifyToken); // DB Speichern

        // Template Path holen
        const templatePath = path.join(__dirname, 'templates', 'twoFactorAuthToken.html');

        // Email versenden
        let htmlTemplate = await createEmailTemplate(templatePath, [
          {
            placeholder: '%username%',
            data: userData.username,
          },
          {
            placeholder: '%token%',
            data: loginVerifyToken,
          },
        ]);

        const hasSend = await sendDynamicEmail({
          email: userData.email,
          subject: 'Your 2FA Login Token',
          text: htmlTemplate,
          html: htmlTemplate,
        });

        if (!hasSend) {
          throw new Error(authTranslator.de.message.emailSend);
        }

        return {
          status: true,
          code: 200,
          requires2FA: true,
          loginVerifyToken,
          responseMessage: '2FA erforderlich',
        };
      }

      const { hasToken, jwtToken } = createAuth(userData, res, loginStay);

      if (!hasToken) {
        throw new Error(authTranslator.de.message.noAuth);
      }

      // User Online Status noch updaten
      await userModel.findOneAndUpdate({ email: userData.email }, { isOnline: true });

      return {
        status: true,
        code: Number(200),
        jwtToken,
        responseMessage: 'Login erfolgreich',
      };
    } else {
      if (!login) {
        throw new Error(authTranslator.de.message.changePassword);
      }

      throw new Error(authTranslator.de.message.noAuth);
    }
  } catch (error) {
    return {
      status: false,
      code: Number(401),
      responseMessage: error.message,
    };
  }
};

export const checkTwoFactorFN = async (email, loginStay, token, res) => {
  try {
    // DB USER wieder holen
    const user = await userModel.findOne({ email });
    if (!user) {
      return {
        status: false,
        code: Number(404),
        responseMessage: 'Ungültiges Token.',
      };
    }

    if (!user.loginVerifyToken || user.loginVerifyToken !== token) {
      return {
        status: false,
        code: Number(400),
        responseMessage: 'Ungültiges Token.',
      };
    }

    if (new Date() > user.loginVerifyTokenExpires) {
      return {
        status: false,
        code: Number(400),
        responseMessage: 'Token abgelaufen.',
      };
    }

    const { hasToken, jwtToken } = createAuth(
      { userId: user._id, email: user.email, role: user.role, profileImage: user.profileImage.url },
      res,
      loginStay
    );

    if (!hasToken) {
      throw new Error(authTranslator.de.message.noAuth);
    }

    // User Online Status noch updaten
    await userModel.findOneAndUpdate({ email: user.email }, { isOnline: true });

    return {
      status: true,
      code: Number(200),
      jwtToken,
      responseMessage: 'Login erfolgreich',
    };
  } catch (error) {
    return {
      status: false,
      code: Number(401),
      responseMessage: error.message,
    };
  }
};

export const createAuth = (userData, res, loginStay) => {
  const authToken = createToken(userData);

  if (!authToken) {
    return false;
  }

  if (loginStay === '1') {
    createCookie(authToken, res); // Cookie setzten
    return {
      hasToken: true,
      jwtToken: null,
    };
  } else {
    //  JWT zurückgeben
    return {
      hasToken: true,
      jwtToken: authToken,
    };
  }
};

/*** FÜR 2FA AUTH ***/
const generateLoginVerifyToken = () => {
  return uuidv4(); // Einfacher Token
};

const saveLoginVerifyToken = async (email, token) => {
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 Minuten gültig

  const update2faTokenUser = await userModel.findOneAndUpdate(
    { email: email },
    {
      loginVerifyToken: token,
      loginVerifyTokenExpires: expires,
    },
    { new: true }
  );

  return update2faTokenUser;
};
