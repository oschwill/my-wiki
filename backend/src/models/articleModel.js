import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Sonstiges',
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'categoryModel',
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'userModel',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  visitors: {
    type: number,
    default: 0,
  },
});

export default mongoose.model('articleModel', articleSchema, 'article');
