import { getContentByIdFN, getLanguagesFN } from '../utils/contentHelper.js';

export const getArea = async (req, res) => {
  const response = await getContentByIdFN(null, 'getAllAreas');
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

export const getCategory = async (req, res) => {
  const response = await getContentByIdFN(null, 'allCategories');
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

export const getAllCategoriesByAreaAndLocale = async (req, res) => {
  const { id } = req.params;
  const { locale } = req.query;

  const response = await getContentByIdFN(id, 'categoryByAreaAndLocale', locale);

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

export const getAllArticlesByCategoryAndLocale = async (req, res) => {
  const { id } = req.params;
  const { locale } = req.query;

  const response = await getContentByIdFN(id, 'allArticlesByCategoryAndLocale', locale);

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

export const getSingleArticleById = async (req, res) => {
  const { id } = req.params;
  const { nocount } = req.query;

  const response = await getContentByIdFN(id, 'singleArticle', null, nocount);

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

/* LANGUAGES */
export const getLanguages = async (req, res) => {
  const response = await getLanguagesFN();
  if (response.status) {
    return res.status(response.code).json({
      success: true,
      data: response.data,
    });
  } else {
    return res.status(response.code).json({
      success: false,
      message: response.responseMessage,
    });
  }
};

/* PUBLIC BY LOCALE */
export const getPublicAreasByLocale = async (req, res) => {
  const { locale } = req.query;

  if (!locale) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Locale fehlt',
      },
    });
  }

  const response = await getContentByIdFN(null, 'areaByLocale', locale);

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        message: response.responseMessage,
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: response.data,
  });
};
