import { dynamicSchema, userSchema, validateData } from '../utils/validateSchemes.js';
import {
  checkPassword,
  createAuth,
  getEmailVerifyCode,
  getUserData,
  registerHelperFN,
  resendEmailTokenFN,
  updateUserStatus,
} from '../utils/authHelper.js';
import { changeImage, deleteImage, uploadImage } from '../utils/cloudHelper.js';
import { changeUserPasswordFN, getCloudPath, updateUserFN } from '../utils/userProfileHelper.js';
import { sanitizeInputs } from '../utils/helperFunctions.js';

export const registerUser = async (req, res) => {
  const userData = sanitizeInputs(req.body);
  let fileData = null;

  try {
    if (req.file) {
      const dynamicPath = `${userData.firstName[0]}${
        userData.lastName
      }_${crypto.randomUUID()}`.toLowerCase();

      const upload = await uploadImage(`my-wiki/userProfile/${dynamicPath}`, req.file);

      if (!upload.status) {
        throw new Error(upload.responseMessage);
      }

      fileData = {
        publicId: upload.fileData.public_id,
        url: upload.fileData.url,
        cloudPath: dynamicPath,
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
  const { email, password } = sanitizeInputs(req.body);

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

export const changeProfileImage = async (req, res) => {
  const { email } = req.user;

  if (req.file) {
    const dynamicPath = await getCloudPath(email);

    const upload = await changeImage(
      `my-wiki/userProfile/${dynamicPath}`,
      req.file,
      email,
      dynamicPath
    );

    if (!upload.status) {
      return res.status(upload.code).json({
        success: false,
        error: {
          path: 'general',
          message: upload.responseMessage.toString(),
        },
      });
    }

    return res.status(upload.code).json({
      success: true,
      message: upload.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  let { email, description, location } = sanitizeInputs(req.body);
  const searchEmail = req.user.email;

  // Validierung
  const updateUserProfileSchema = dynamicSchema(['email', 'description', 'location'], userSchema);

  const { error, value } = validateData({ email, description, location }, updateUserProfileSchema);

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
    return res.status(updateUser.code).json({
      success: false,
      error: updateUser.responseMessage.toString(),
    });
  }

  // Falls Email geändert wurde müssen wir ein neues Cookie erstellen
  if (updateUser.oldData.email !== email) {
    createAuth({ userId: updateUser._id, email, role: updateUser.role }, res);
  }

  return res.status(updateUser.code).json({
    success: true,
    message: 'Ihre Profildaten wurden erfolgreich geändert',
  });
};
