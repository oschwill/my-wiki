import {
  deleteContentFN,
  getContentByIdFN,
  getUserContentByUserAndId,
  insertOrUpdateContentFN,
  manipulateArticlePublicationFN,
} from '../utils/contentHelper.js';
import { sanitizeInputs } from '../utils/helperFunctions.js';
import { contentSchema, validatorHelperFN } from '../utils/validateSchemes.js';

export const insertOrUpdateArticle = async (req, res) => {
  const {
    category,
    contentTitle,
    content,

    allowCommentsection,
    allowExportToPDF,
    allowPrinting,
    allowSharing,
    allowEditing,
    allowShowAuthor,
  } = sanitizeInputs(req.body);
  const { userId, role } = req.user;
  const { id } = req.params;
  const { externalUser } = req.query;

  const isUpdate = Boolean(id);

  const flags = {
    allowCommentsection: allowCommentsection === 'true',
    allowExportToPDF: allowExportToPDF === 'true',
    allowPrinting: allowPrinting === 'true',
    allowSharing: allowSharing === 'true',
    allowEditing: allowEditing === 'true',
    allowShowAuthor: allowShowAuthor === 'true',
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
      ...(isUpdate ? { updatedAt: new Date() } : { createdAt: new Date(), createdBy: userId }),
      ...flags,
    },
    'article',
    'Der Artikel wurde erfolgreich eingefügt!',
    id,
    role,
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
    _id: response._id,
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

export const ShowMyArticles = async (req, res) => {
  const { userId } = req.user;

  const response = await getContentByIdFN(userId, 'getArticlesByUser', null);

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        path: 'general',
        message: response.responseMessage,
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    data: response.data,
  });
};

export const publishOrDraftArticle = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  // User status ändern
  const response = await manipulateArticlePublicationFN(id, userId);

  if (!response.status) {
    return res.status(response.code).json({
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

export const getUserArticleById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const response = await getUserContentByUserAndId(id, 'getUserArticleByID', userId);

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        path: 'general',
        message: response.responseMessage,
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    data: response.data,
  });
};
