import { insertAreaFN } from '../utils/adminHelper.js';
import { sanitizeInputs } from '../utils/helperFunctions.js';
import { contentSchema, dynamicSchema, validateData } from '../utils/validateSchemes.js';

export const insertArticle = async (req, res) => {
  const { category, contentTitle, content } = sanitizeInputs(req.body);
  const { userId } = req.user;

  // Valididierung
  const articleSchema = dynamicSchema(['reference', 'content', 'contentTitle'], contentSchema);

  const { error, value } = validateData(
    { reference: category, content, contentTitle },
    articleSchema
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

  const response = await insertAreaFN(value.reference, value.contentTitle, value.content, userId);
};
