import areaModel from '../models/areaModel.js';
import categoryModel from '../models/categoryModel.js';
import articleModel from '../models/articleModel.js';
import { contentTranslator } from './errorTranslations.js';
import languageModel from '../models/languageModel.js';
import mongoose from 'mongoose';

export const generateObjectId = () => new mongoose.Types.ObjectId();

/* CREATE UPDATE DELETE */
export const insertOrUpdateContentFN = async (
  data,
  modelType,
  successMessage,
  id = null,
  role = null,
) => {
  try {
    let model;
    let entry;
    // Standardmäßig für category und area oder admin role, Admin kann alles updaten
    let query = { _id: id };

    // Bauen uns unser Model und eventuell unser searchQuery fürs updaten
    switch (modelType) {
      case 'article':
        model = articleModel;
        query = role === 'creator' ? { _id: id, createdBy: data.createdBy } : query;
        break;
      case 'category':
        model = categoryModel;
        break;
      case 'area':
        model = areaModel;
        break;
      default:
        throw new Error(contentTranslator.de.message.general);
    }

    // Checken ob wir inserten oder updaten
    if (id) {
      const options = { new: true, runValidators: true };
      entry = await model.findOneAndUpdate(query, data, { ...options, upsert: false });
    } else {
      entry = new model(data);
      await entry.save();
    }
    if (!entry) {
      throw new Error(contentTranslator.de.message.general);
    }

    return {
      status: true,
      code: Number(201),
      responseMessage: successMessage,
      _id: entry._id,
    };
  } catch (error) {
    if (error?.code === 11000) {
      return {
        status: false,
        code: Number(401),
        errorCode: error?.code,
        responseMessage: contentTranslator.de.message.unique,
      };
    } else {
      return {
        status: false,
        code: Number(401),
        errorCode: error?.code,
        responseMessage: error.message,
      };
    }
  }
};

export const deleteContentFN = async (id, modelType, successMessage) => {
  try {
    let model;

    switch (modelType) {
      case 'article':
        model = articleModel;
        break;
      case 'category':
        model = categoryModel;
        break;
      case 'area':
        model = areaModel;
        break;
      default:
        throw new Error(contentTranslator.de.message.general);
    }

    const document = await model.findById(id);

    if (!document) {
      throw new Error(contentTranslator.de.message.deleteContent);
    }

    await model.deleteOne({ _id: id });

    return {
      status: true,
      code: Number(201),
      responseMessage: successMessage,
    };
  } catch (error) {
    return {
      status: false,
      code: Number(401),
      responseMessage: error.message,
    };
  }
};

/* GET */
export const getContentByIdFN = async (id, type, locale = null, nocount = false) => {
  try {
    let contentData = null;
    switch (type) {
      case 'getAllAreas': // admin
        contentData = await areaModel.find().populate('language');
        break;
      case 'areaByLocale':
        contentData = await areaModel.find().populate({
          path: 'language',
          match: locale ? { locale } : {},
        });

        if (locale) {
          contentData = contentData.filter((a) => a.language);
        }

        break;
      case 'allCategories': // admin
        contentData = await categoryModel.find().populate('area').populate('language');
        break;
      case 'categoryByAreaAndLocale':
        contentData = await categoryModel
          .find({ area: id })
          .populate({
            path: 'language',
            match: locale ? { locale } : {},
          })
          .populate('area');

        if (locale) {
          contentData = contentData.filter((c) => c.language);
        }

        break;
      case 'allArticlesByCategoryAndLocale':
        contentData = await articleModel.find({ category: id, published: true }).populate({
          path: 'category',
          populate: {
            path: 'area',
            model: 'areaModel',
          },
        });
        break;
      case 'singleArticle':
        if (nocount === 'true') {
          // Nur lesen — KEIN zählen
          contentData = await articleModel
            .findOne({ _id: id, published: true })
            .populate({
              path: 'category',
              populate: {
                path: 'area',
                model: 'areaModel',
              },
            })
            .populate('createdBy');
        } else {
          // Besucher zählen
          contentData = await articleModel
            .findOneAndUpdate(
              { _id: id, published: true },
              { $inc: { visitors: 1 } },
              { new: true },
            )
            .populate({
              path: 'category',
              populate: {
                path: 'area',
                model: 'areaModel',
              },
            })
            .populate('createdBy');
        }

        break;
      case 'lastArticlesByLocale':
        contentData = await articleModel.aggregate([
          { $match: { published: true } },
          { $addFields: { sortDate: { $ifNull: ['$updatedAt', '$createdAt'] } } },
          { $sort: { sortDate: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: 'category',
              localField: 'category',
              foreignField: '_id',
              as: 'category',
            },
          },
          { $unwind: '$category' },
          {
            $lookup: {
              from: 'area',
              localField: 'category.area',
              foreignField: '_id',
              as: 'category.area',
            },
          },
          { $unwind: '$category.area' },
          {
            $lookup: {
              from: 'languages',
              localField: 'category.language',
              foreignField: '_id',
              as: 'language',
            },
          },
          { $unwind: '$language' },
          {
            $match: {
              'language.locale': locale,
            },
          },
        ]);

        break;
      case 'getArticlesByUser':
        contentData = await articleModel
          .find({ createdBy: id })
          .sort({ createdAt: -1 })
          .populate({
            path: 'category',
            populate: {
              path: 'area',
              model: 'areaModel',
            },
          });
        break;
      default:
        break;
    }

    if (!contentData) {
      throw new Error(contentTranslator.de.message.noDataFound);
    }

    return {
      status: true,
      code: Number(200),
      data: contentData,
    };
  } catch (error) {
    return {
      status: false,
      code: Number(403),
      responseMessage: error.message,
    };
  }
};

export const getLanguagesFN = async () => {
  try {
    const languages = await languageModel.find().sort({ key: 1 });

    return {
      status: true,
      code: 200,
      data: languages,
    };
  } catch (error) {
    return {
      status: false,
      code: 403,
      responseMessage: error.message || contentTranslator.de.message.noLanguageFound,
    };
  }
};

export const manipulateArticlePublicationFN = async (artId, userId) => {
  try {
    const article = await articleModel
      .findOne({ _id: artId, createdBy: userId })
      .select('published');

    if (!article) {
      return {
        status: false,
        code: 404,
        responseMessage: 'Artikel nicht gefunden oder du hast keine Berechtigung.',
      };
    }

    const newStatus = !article.published;

    // Update published Field
    const updatedArticle = await articleModel.findOneAndUpdate(
      { _id: artId, createdBy: userId },
      { published: newStatus },
      { new: true },
    );

    if (!updatedArticle) {
      return {
        status: false,
        code: 500,
        responseMessage: 'Fehler beim Aktualisieren des Veröffentlichungsstatus.',
      };
    }

    return {
      status: true,
      code: 200,
      responseMessage: newStatus
        ? 'Der Artikel wurde erfolgreich veröffentlicht.'
        : 'Die Veröffentlichung des Artikels wurde zurückgezogen.',
    };
  } catch (err) {
    return {
      status: false,
      code: 500,
      responseMessage: err.message || 'Fehler beim Ändern des Veröffentlichungsstatus.',
    };
  }
};
