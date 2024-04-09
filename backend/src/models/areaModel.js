import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Sonstiges',
  },
  description: {
    type: String,
  },
});

export default mongoose.model('areaModel', areaSchema, 'area');
