import AreaModel from '../models/areaModel.js';
import categoryModel from '../models/categoryModel.js';
import { contentTranslator } from './errorTranslations.js';

export const insertAreaFN = async (area, description) => {
  try {
    const newArea = new AreaModel({
      title: area,
      description,
    });

    const entry = await newArea.save();

    if (!entry) {
      throw new Error(contentTranslator.de.message.general);
    }

    return {
      status: true,
      code: Number(201),
      responseMessage: 'Das Fachgebiet wurde erfolgreich eingefügt',
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

export const insertCategoryFN = async (area, category, description) => {
  try {
    const newCategory = new categoryModel({
      title: category,
      description,
      area,
    });

    const entry = await newCategory.save();

    if (!entry) {
      throw new Error(contentTranslator.de.message.general);
    }

    return {
      status: true,
      code: Number(201),
      responseMessage: 'Die Kategorie wurde erfolgreich eingefügt',
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
