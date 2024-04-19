import areaModel from '../models/areaModel.js';
import categoryModel from '../models/categoryModel.js';
import articleModel from '../models/articleModel.js';
import { contentTranslator } from './errorTranslations.js';

export const insertContentFN = async (data, modelType, successMessage) => {
  try {
    let newContent = null;
    switch (modelType) {
      case 'article':
        newContent = new articleModel(data);
        break;
      case 'category':
        newContent = new categoryModel(data);
        break;
      case 'area':
        newContent = new areaModel(data);
        break;
      default:
        throw new Error(contentTranslator.de.message.general);
    }

    console.log(newContent);

    const entry = await newContent.save();

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
