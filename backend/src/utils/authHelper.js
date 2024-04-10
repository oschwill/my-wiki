import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';

export const registerHelperFN = async (data, fileData) => {
  // erzeugen ein Email Token
  const emailVerifyToken = Math.random().toString().slice(2, 8);
  // hashen datt Password
  const hashedPassword = await hashPassword(data.password);

  // Datenbank Eintrag
  const newUser = new userModel({
    firstName: data.firstName,
    lastName: data.lastName,
    description: data.description,
    location: data.location,
    password: hashedPassword,
    email: data.email,
    emailVerifyCode: emailVerifyToken,
    profileImage: fileData,
  });

  const entry = await newUser.save();

  if (!entry) {
    return false;
  }

  // Email versenden

  return true;
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};
