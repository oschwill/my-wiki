import areaModel from '../models/areaModel.js';
import categoryModel from '../models/categoryModel.js';
import articleModel from '../models/articleModel.js';
import { contentTranslator } from './errorTranslations.js';

export const insertOrUpdateContentFN = async (
  data,
  modelType,
  successMessage,
  id = null,
  role = null
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
    };
  } catch (error) {
    console.log(error);
    if (error?.code === 11000) {
      return {
        status: false,
        code: Number(401),
        responseMessage: contentTranslator.de.message.unique,
      };
    } else {
      return {
        status: false,
        code: Number(401),
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
    console.log(error);

    return {
      status: false,
      code: Number(401),
      responseMessage: error.message,
    };
  }
};
