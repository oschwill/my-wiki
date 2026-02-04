import userModel from '../models/userModel.js';
import { authTranslator, contentTranslator } from './errorTranslations.js';
import languageModel from '../models/languageModel.js';
import categoryModel from '../models/categoryModel.js';
import areaModel from '../models/areaModel.js';

const errorMessages = {
  auth: authTranslator.de.message.blockUser,
  upgrade: authTranslator.de.message.upgradeUser,
};

export const manipulateUserRightsFN = async (email, type) => {
  try {
    let data = null;
    let successMessage = '';

    const user = await userModel.findOne({ email: email });

    if (!user) {
      throw new Error(errorMessages[type]);
    }

    if (type === 'auth') {
      data = { active: !user.active };
      successMessage =
        user.active === true ? 'Der User wurde gebannt' : 'Der User wurde freigeschaltet';
    }

    if (type === 'upgrade') {
      data = { role: user.role === 'visitor' ? 'creator' : 'visitor' };
      successMessage =
        user.role === 'visitor'
          ? 'Der User wurde auf Creator geupgraded'
          : 'Der User wurde auf Visitor gedowngraded';
    }

    const manipulateUserStatus = await userModel.findOneAndUpdate({ email }, data, {
      new: true,
      returnOriginal: false,
    });

    if (!manipulateUserStatus) {
      throw new Error(errorMessages[type]);
    }

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

export const deleteUserFN = async (email, successMessage) => {
  try {
    const deleteUser = await userModel.findOne({ email });

    if (!deleteUser) {
      throw new Error(authTranslator.de.message.deleteUser);
    }

    await userModel.deleteOne({ email });

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

export const getAllUserFN = async () => {
  try {
    const allUsers = await userModel.find(
      {},
      '_id role firstName lastName location email active createdAt updatedAt ipAdress username provider',
    );

    return {
      status: true,
      code: Number(200),
      users: allUsers,
    };
  } catch (error) {
    return {
      status: false,
      code: Number(400),
      responseMessage: 'Keine User vorhanden.',
      users: null,
    };
  }
};

/*LANGUAGES */
export const insertLanguageFN = async (data, successMessage) => {
  try {
    const exists = await languageModel.findOne({ key: data.key });
    if (exists) {
      return {
        status: false,
        code: 401,
        responseMessage: contentTranslator.de.message.uniqueLanguage,
      };
    }

    const entry = new languageModel(data);
    await entry.save();

    return {
      status: true,
      code: 201,
      responseMessage: successMessage,
      _id: entry._id,
    };
  } catch (error) {
    return {
      status: false,
      code: 401,
      responseMessage: error.message,
    };
  }
};

export const deleteLanguageFN = async (id, successMessage) => {
  try {
    const entry = await languageModel.findById(id);

    if (!entry) {
      return {
        status: false,
        code: 401,
        responseMessage: contentTranslator.de.message.deleteContent,
      };
    }

    const usedInCategory = await categoryModel.exists({ language: id });
    if (usedInCategory) {
      return {
        status: false,
        code: 401,
        responseMessage: 'Sprache kann nicht gelöscht werden, da sie in Kategorien verwendet wird.', // kommt später aus der translation yaml
      };
    }

    const usedInArea = await areaModel.exists({ language: id });
    if (usedInArea) {
      return {
        status: false,
        code: 401,
        responseMessage:
          'Sprache kann nicht gelöscht werden, da sie in Fachgebiete verwendet wird.',
      };
    }

    await languageModel.deleteOne({ _id: id });

    return {
      status: true,
      code: 201,
      responseMessage: successMessage,
    };
  } catch (error) {
    return {
      status: false,
      code: 401,
      responseMessage: error.message,
    };
  }
};

export const toggleLanguageFN = async (id, enabled) => {
  try {
    if (!id || typeof enabled !== 'boolean') {
      throw new Error('Fehlerhafte Parameter');
    }

    const language = await languageModel.findById(id);

    if (!language) {
      return {
        status: false,
        code: 404,
        responseMessage: contentTranslator.de.message.noDataFound,
      };
    }

    language.enabled = enabled;
    await language.save();

    return {
      status: true,
      code: 200,
      responseMessage: `Sprache ${enabled ? 'aktiviert' : 'deaktiviert'}`,
    };
  } catch (error) {
    return {
      status: false,
      code: 500,
      responseMessage: error.message,
    };
  }
};
