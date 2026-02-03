import { deleteContentFN, insertOrUpdateContentFN } from '../utils/contentHelper.js';
import { sanitizeInputs } from '../utils/helperFunctions.js';
import { contentSchema, validatorHelperFN } from '../utils/validateSchemes.js';

export const insertArticle = async (req, res) => {
  const {
    category,
    contentTitle,
    content,

    allowCommentsection,
    allowExportToPDF,
    allowPrinting,
    allowSharing,
    allowEditing,
  } = sanitizeInputs(req.body);
  const { userId } = req.user;

  const flags = {
    allowCommentsection: allowCommentsection === 'true',
    allowExportToPDF: allowExportToPDF === 'true',
    allowPrinting: allowPrinting === 'true',
    allowSharing: allowSharing === 'true',
    allowEditing: allowEditing === 'true',
  };

  // Valididierung
  const { error, value } = validatorHelperFN(
    ['reference', 'content', 'contentTitle'],
    {
      reference: category,
      content,
      contentTitle,
    },
    contentSchema,
    res,
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

  const response = await insertOrUpdateContentFN(
    {
      title: value.contentTitle,
      content: value.content,
      category: value.reference,
      createdBy: userId,
      createdAt: new Date(),
      ...flags,
    },
    'article',
    'Der Artikel wurde erfolgreich eingefügt!',
  );

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        path: 'general',
        errorCode: response.errorCode,
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
  const { role } = req.user;
  const { id } = req.params;

  // Valididierung
  const value = validatorHelperFN(
    ['reference', 'content', 'contentTitle'],
    {
      reference: category,
      content,
      contentTitle,
    },
    contentSchema,
    res,
  );

  if (!value) {
    return;
  }

  const response = await insertOrUpdateContentFN(
    {
      title: value.contentTitle,
      content: value.content,
      category: value.reference,
      createdBy: userId,
      updatedAt: new Date(),
    },
    'article',
    'Der Artikel wurde erfolgreich geändert',
    id,
    role,
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

export const deleteArticle = async (req, res) => {
  const { id } = req.params;

  // Löschen des Contents
  const response = await deleteContentFN(id, 'article', 'Der Artikel wurde erfolgreich gelöscht');

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
