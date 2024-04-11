import { userSchema, validateData } from '../utils/validateSchemes.js';
import {
  getEmailVerifyCode,
  registerHelperFN,
  resendEmailTokenFN,
  updateUserStatus,
} from '../utils/authHelper.js';
import { deleteImage } from '../utils/cloudHelper.js';

export const registerUser = async (req, res) => {
  const userData = req.body;
  let fileData = null;

  if (req.fileData) {
    fileData = {
      publicId: req?.fileData.public_id,
      url: req?.fileData.url,
    };
  }

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
    req.fileData && (await deleteImage(req.fileData.public_id));

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
