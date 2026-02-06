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
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'userModel',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  visitors: {
    type: Number,
    default: 0,
  },
  published: {
    type: Boolean,
    default: false,
  },
  // Feature-Flags
  allowCommentsection: { type: Boolean, default: true },
  allowExportToPDF: { type: Boolean, default: false },
  allowPrinting: { type: Boolean, default: true },
  allowSharing: { type: Boolean, default: true },
  allowEditing: { type: Boolean, default: false },
  allowShowAuthor: { type: Boolean, default: true },
});

export default mongoose.model('articleModel', articleSchema, 'article');
