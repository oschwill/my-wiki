import { userSchema, validateData, validatorHelperFN } from '../utils/validateSchemes.js';
import {
  checkPassword,
  checkTwoFactorFN,
  createAuth,
  getEmailVerifyCode,
  getUserData,
  registerHelperFN,
  resendEmailTokenFN,
  updateUserStatus,
} from '../utils/authHelper.js';
import { deleteImage } from '../utils/cloudHelper.js';
import {
  changeUserPasswordFN,
  getMyProfileDataFN,
  updateUserFN,
} from '../utils/userProfileHelper.js';
import { sanitizeInputs } from '../utils/helperFunctions.js';
import userModel from '../models/userModel.js';

export const registerUser = async (req, res) => {
  const userData = sanitizeInputs(req.body);
  let fileData = null;

  try {
    // Validierung
    const { error, value } = validateData(userData, userSchema);
    if (error) {
      const returnErrorMessages = error.details.map((cur) => {
        const { path, message } = cur;
        return { path: path.join(''), message };
      });

      return res.status(401).json({
        success: false,
        error: returnErrorMessages,
      });
    }

    const response = await registerHelperFN(value);

    if (!response.status) {
      throw new Error(response.message);
    }

    return res.status(201).json({
      success: true,
      message: response.message,
    });
  } catch (error) {
    console.log(error.message);
    // lösche wieder das Image, falls vorhanden
    req.file && (await deleteImage(fileData.publicId));

    return res.status(401).json({
      success: false,
      error: {
        path: 'general',
        message: error.message.toString(),
      },
    });
  }
};

export const completeRegisterUser = async (req, res) => {
  const { emailVerifyCode, email } = sanitizeInputs(req.body);

  // checken ob der Token übereinstimmt
  const checkToken = await getEmailVerifyCode({ emailVerifyCode, email });

  if (!checkToken.status) {
    return res.status(checkToken.code).json({
      success: checkToken.status,
      error: {
        path: 'general',
        message: checkToken.responseMessage.toString(),
      },
    });
  }

  // nun updaten wir den User auf active
  const response = await updateUserStatus(email);

  if (!response.status) {
    return res.status(response.code).json({
      success: response.status,
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: response.status,
    message: response.responseMessage,
  });
};

export const resendEmailToken = async (req, res) => {
  const { email } = sanitizeInputs(req.body);

  const createNewToken = await resendEmailTokenFN(email);

  if (!createNewToken) {
    return res.status(createNewToken.code).json({
      success: createNewToken.status,
      error: {
        path: 'general',
        message: createNewToken.responseMessage.toString(),
      },
    });
  }

  return res.status(createNewToken.code).json({
    success: createNewToken.status,
    message: createNewToken.responseMessage,
  });
};

export const loginUser = async (req, res) => {
  const { email, password, loginStay } = sanitizeInputs(req.body);
  const user = await getUserData(email);

  if (!user.status) {
    return res.status(user.code).json({
      success: false,
      error: {
        message: user.responseMessage.toString(),
      },
    });
  }

  const hasPassword = await checkPassword(user.data, password, loginStay, res);

  if (!hasPassword.status) {
    return res.status(hasPassword.code).json({
      success: false,
      error: {
        message: hasPassword.responseMessage.toString(),
      },
    });
  }

  return res.status(hasPassword.code).json({
    success: true,
    hasTwoFactorAuth: hasPassword.requires2FA || false,
    jwtToken: hasPassword.jwtToken,
    message: hasPassword.responseMessage,
  });
};

export const checkTwoFactorToken = async (req, res) => {
  const { email, loginStay, token } = sanitizeInputs(req.body);

  const hasLogin = await checkTwoFactorFN(email, loginStay, token, res);

  if (!hasLogin.status) {
    console.log({
      success: false,
      error: {
        message: hasLogin.responseMessage.toString(),
      },
    });
    return res.status(hasLogin.code).json({
      success: false,
      error: {
        message: hasLogin.responseMessage.toString(),
      },
    });
  }

  return res.status(hasLogin.code).json({
    success: true,
    hasTwoFactorAuth: hasLogin.requires2FA || false,
    jwtToken: hasLogin.jwtToken,
    message: hasLogin.responseMessage,
  });
};

export const logOutUser = async (req, res) => {
  try {
    const user = req.user;

    if (user?.email) {
      await userModel.findOneAndUpdate({ email: user.email }, { isOnline: false });
    }

    res.clearCookie('auth', {
      path: '/',
      httpOnly: true,
      secure: process.env.ENV === 'prod',
      sameSite: 'lax',
    });

    // oAuth ausloggen
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.logout((err) => {
        if (err) {
          console.warn('Logout error:', err);
          return res.status(500).json({ error: 'Logout failed' });
        }

        req.session.destroy((err) => {
          if (err) {
            console.warn('Session destroy error:', err);
            return res.status(500).json({ error: 'Session destruction failed' });
          }

          res.status(200).send('Logged out (OAuth)');
        });
      });
    } else {
      res.status(200).send('Logged out (JWT)');
    }
  } catch (error) {
    console.warn('Logout handler failed:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const changeUserPassword = async (req, res) => {
  const { oldPassword, password, repeatPassword } = sanitizeInputs(req.body);
  const { email } = req.user;

  const user = await getUserData(email);

  if (!user.status) {
    return res.status(user.code).json({
      success: false,
      error: {
        path: 'general',
        message: user.responseMessage.toString(),
      },
    });
  }

  // Altes Password auf Richtigkeit cheken
  const hasPassword = await checkPassword(user.data, oldPassword, res, false);

  if (!hasPassword.status) {
    return res.status(hasPassword.code).json({
      success: false,
      error: {
        path: 'general',
        message: hasPassword.responseMessage.toString(),
      },
    });
  }

  // Neues Password validieren
  const { error, value } = validatorHelperFN(
    ['password', 'repeatPassword'],
    { password, repeatPassword },
    passwordSchema
  );

  if (error) {
    const returnErrorMessages = error.details.map((cur) => {
      const { path, message } = cur;
      return { path: path.join(''), message };
    });

    return res.status(401).json({
      success: false,
      error: returnErrorMessages,
    });
  }

  // Password in db schreiben und Email versenden!
  const hasChangedPassword = await changeUserPasswordFN(value.password, email);

  if (!hasChangedPassword.status) {
    return res.status(hasChangedPassword.code).json({
      success: false,
      error: {
        path: 'general',
        message: hasChangedPassword.responseMessage.toString(),
      },
    });
  }

  return res.status(hasChangedPassword.code).json({
    success: true,
    message: hasChangedPassword.responseMessage,
  });
};

export const updateUserProfile = async (req, res) => {
  let userData = sanitizeInputs(req.body);
  const searchEmail = req.user.email;

  try {
    // Validierung
    const { error, value } = validatorHelperFN(Object.keys(userData), userData, userSchema);

    if (error) {
      const returnErrorMessages = error.details.map((cur) => {
        const { path, message } = cur;
        return { path: path.join(''), message };
      });

      return res.status(401).json({
        success: false,
        error: returnErrorMessages,
      });
    }

    const updateUser = await updateUserFN({ email: searchEmail, active: true }, value);

    if (!updateUser.status) {
      console.log('HÄÄÄ?');
      return res.status(updateUser.code).json({
        success: false,
        error: updateUser.responseMessage.toString(),
      });
    }

    console.log(updateUser);

    return res.status(updateUser.code).json({
      success: true,
      message: 'Ihre Profildaten wurden erfolgreich geändert',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        path: 'general',
        message: 'Ein unerwarteter Fehler ist aufgetreten.',
      },
    });
  }
};

export const checkAuth = async (req, res) => {
  if (req.user) {
    return res.status(200).json(req.user);
  }

  return res.status(200).json({
    user: null,
  });
};

export const getMyProfileData = async (req, res) => {
  const { email } = req.user;

  if (email) {
    const responseData = await getMyProfileDataFN(email);

    if (responseData) {
      return res.status(200).json({
        success: true,
        user: responseData,
      });
    }

    return res.status(400).json({
      success: false,
      user: null,
    });
  }

  return res.status(400).json({
    success: false,
    user: null,
  });
};
