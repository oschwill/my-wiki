import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Sonstiges',
  },
  description: {
    type: String,
  },
  area: {
    type: mongoose.Schema.ObjectId,
    ref: 'areaModel',
  },
});

export default mongoose.model('categoryModel', categorySchema, 'category');
