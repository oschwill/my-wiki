import { insertContentFN } from '../utils/contentHelper.js';
import { sanitizeInputs } from '../utils/helperFunctions.js';
import { contentSchema, validatorHelperFN } from '../utils/validateSchemes.js';

export const insertArea = async (req, res) => {
  const { area, description } = sanitizeInputs(req.body);

  // Valididierung
  const value = validatorHelperFN(
    ['area', 'description'],
    { area, description },
    contentSchema,
    res
  );

  if (!value) {
    return;
  }

  const response = await insertContentFN(
    {
      title: value.area,
      description: value.description,
    },
    'area',
    'Das Fachgebiet wurde erfolgreich eingefügt'
  );

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
  const value = validatorHelperFN(
    ['reference', 'category', 'description'],
    { reference: area, category, description },
    contentSchema,
    res
  );

  if (!value) {
    return;
  }

  const response = await insertContentFN(
    {
      title: value.category,
      description: value.description,
      area: value.reference,
    },
    'category',
    'Die Kategorie wurde erfolgreich eingefügt'
  );

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
