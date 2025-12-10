import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  locale: { type: String, required: true },
  country: { type: String },
  enabled: { type: Boolean, default: true },
});

export default mongoose.model('languageModel', languageSchema, 'languages');
