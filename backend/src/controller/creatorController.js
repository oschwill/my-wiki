import { insertContentFN } from '../utils/contentHelper.js';
import { sanitizeInputs } from '../utils/helperFunctions.js';
import { contentSchema, validatorHelperFN } from '../utils/validateSchemes.js';

export const insertArticle = async (req, res) => {
  const { category, contentTitle, content } = sanitizeInputs(req.body);
  const { userId } = req.user;

  // Valididierung
  const value = validatorHelperFN(
    ['reference', 'content', 'contentTitle'],
    {
      reference: category,
      content,
      contentTitle,
    },
    contentSchema,
    res
  );

  if (!value) {
    return;
  }

  const response = await insertContentFN(
    {
      title: value.contentTitle,
      content: value.content,
      category: value.reference,
      createdBy: userId,
      createdAt: new Date(),
    },
    'article',
    'Der Artikel wurde erfolgreich eingefügt'
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

export const updateArticle = async (req, res) => {
  const { category, contentTitle, content } = sanitizeInputs(req.body);
  const { userId } = req.user;
  const { articleId } = req.params;
  console.log(articleId);
  // To be continued...
};
