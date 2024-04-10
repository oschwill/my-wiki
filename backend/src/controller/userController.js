import { userSchema, validateData } from '../utils/validateSchemes.js';
import { registerHelperFN } from '../utils/authHelper.js';
import { registerTranslator } from '../utils/errorTranslations.js';
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

    if (!response) {
      throw new Error();
    }

    return res.status(201).json({
      success: true,
      message:
        'Die Registrierung war erfolgreich, bitte checken Sie Ihre Email und geben sie das Token ein um die Registrierung abzuschließen',
    });
  } catch (error) {
    console.log(error);

    // lösche wieder das Image, falls vorhanden
    req.fileData && (await deleteImage(req.fileData.public_id));

    return res.status(401).json({
      success: false,
      error: {
        path: 'general',
        message: registerTranslator.de.message.general,
      },
    });
  }
};
