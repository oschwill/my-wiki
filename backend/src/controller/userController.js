import { dynamicSchema, userSchema, validateData } from '../utils/validateSchemes.js';
import {
  checkPassword,
  getEmailVerifyCode,
  getUserData,
  registerHelperFN,
  resendEmailTokenFN,
  updateUserStatus,
} from '../utils/authHelper.js';
import { deleteImage, uploadImage } from '../utils/cloudHelper.js';
import { changeUserPasswordFN } from '../utils/userProfileHelper.js';

export const registerUser = async (req, res) => {
  const userData = req.body;
  let fileData = null;

  try {
    if (req.file) {
      const upload = await uploadImage(
        `my-wiki/userProfile/${userData.email.replace('@', '').replace('.', '')}`,
        req.file
      );

      if (!upload.status) {
        throw new Error(upload.responseMessage);
      }

      fileData = {
        publicId: upload.fileData.public_id,
        url: upload.fileData.url,
      };
    }
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

    const response = await registerHelperFN(value, fileData);

    if (!response.status) {
      throw new Error(response.message);
    }

    return res.status(201).json({
      success: true,
      message: response.message,
    });
  } catch (error) {
    // lösche wieder das Image, falls vorhanden
    req.file && (await deleteImage(fileData.publicId));

    return res.status(401).json({
      success: false,
      error: {
        path: 'general',
        message: error.toString(),
      },
    });
  }
};

export const completeRegisterUser = async (req, res) => {
  const { emailVerifyCode, email } = req.body;

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
  const { email } = req.body;

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
  const { email, password } = req.body;

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

  const hasPassword = await checkPassword(user.data, password, res);

  if (!hasPassword.status) {
    return res.status(hasPassword.code).json({
      success: false,
      error: {
        path: 'general',
        message: hasPassword.responseMessage.toString(),
      },
    });
  }

  return res.status(hasPassword.code).json({
    success: true,
    message: hasPassword.responseMessage,
  });
};

export const logOutUser = async (_, res) => {
  res.cookie('auth', '', { expires: new Date(0), path: '/', httpOnly: true, secure: true });
  res.send('Logged out');
};

export const changeUserPassword = async (req, res) => {
  const { oldPassword, password, repeatPassword } = req.body;
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
  const passwordSchema = dynamicSchema(['password', 'repeatPassword'], userSchema);

  const { error, value } = validateData({ password, repeatPassword }, passwordSchema);

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
