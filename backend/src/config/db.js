import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);

    console.log('DB CONNECTED');
  } catch (error) {
    console.log(`DATABASE ERROR ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
