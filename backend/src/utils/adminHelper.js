import userModel from '../models/userModel.js';
import { authTranslator } from './errorTranslations.js';

export const blockOrUnblockUserFN = async (email) => {
  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      throw new Error(authTranslator.de.message.blockUser);
    }

    const blockUserStatus = await userModel.findOneAndUpdate(
      { email },
      { active: !user.active },
      { new: true, returnOriginal: false }
    );

    if (!blockUserStatus) {
      throw new Error(authTranslator.de.message.blockUser);
    }

    return {
      status: true,
      code: Number(201),
      responseMessage:
        blockUserStatus.active === true
          ? 'Der User wurde freigeschaltet'
          : 'Der User wurde gebannt',
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
