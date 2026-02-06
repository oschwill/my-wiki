import mongoose from 'mongoose';
import articleModel from '../models/articleModel.js';
import categoryModel from '../models/categoryModel.js';
import areaModel from '../models/areaModel.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);

    console.log('DB CONNECTED');
  } catch (error) {
    console.log(`DATABASE ERROR ${error.message}`);
    process.exit(1);
  }
};

export const connectForMockupDB = async () => {
  await mongoose.connect(process.env.MONGO_DB);

  // Bereinige alle Content Collections vorher

  await articleModel.deleteMany({});
  await categoryModel.deleteMany({});
  await areaModel.deleteMany({});
};

export const closeDB = async () => {
  await mongoose.disconnect();
};

export default connectDB;
