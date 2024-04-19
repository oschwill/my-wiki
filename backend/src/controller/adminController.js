import { insertAreaFN, insertCategoryFN } from '../utils/adminHelper.js';
import { sanitizeInputs } from '../utils/helperFunctions.js';
import { contentSchema, dynamicSchema, validateData } from '../utils/validateSchemes.js';

export const insertArea = async (req, res) => {
  const { area, description } = sanitizeInputs(req.body);

  // Valididierung
  const areaSchema = dynamicSchema(['area', 'description'], contentSchema);

  const { error, value } = validateData({ area, description }, areaSchema);

  if (error) {
    return res.status(401).json({
      success: false,
      error: {
        path: 'general',
        message: error.message,
      },
    });
  }

  const response = await insertAreaFN(value.area, value.description);

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    message: response.responseMessage,
  });
};

export const insertCategory = async (req, res) => {
  const { area, category, description } = sanitizeInputs(req.body);

  // Valididierung
  const categorySchema = dynamicSchema(['reference', 'category', 'description'], contentSchema);

  const { error, value } = validateData({ reference: area, category, description }, categorySchema);

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

  const response = await insertCategoryFN(value.reference, value.category, value.description);

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    message: response.responseMessage,
  });
};
