import { getContentByIdFN } from '../utils/contentHelper.js';

export const getArea = async (req, res) => {
  const response = await getContentByIdFN(null, 'area');
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

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  const response = await getContentByIdFN(id, 'category');

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

export const getAllArticlesByCategory = async (req, res) => {
  const { id } = req.params;

  const response = await getContentByIdFN(id, 'allArticles');

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

  const response = await getContentByIdFN(id, 'singleArticle');

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
