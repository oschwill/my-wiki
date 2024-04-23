import userModel from '../models/userModel.js';
import { authTranslator } from './errorTranslations.js';

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
    console.log(error);

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
    console.log(error);

    return {
      status: false,
      code: Number(401),
      responseMessage: error.message,
    };
  }
};
