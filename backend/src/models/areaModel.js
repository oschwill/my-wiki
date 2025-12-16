import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
  translationGroup: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  title: { type: String, required: true, default: 'Sonstiges' },
  description: { type: String, required: true },
  queryPath: { type: String, required: true },
  icon: { type: String, required: true },
  language: { type: mongoose.Schema.ObjectId, ref: 'languageModel', required: true, index: true },
});

areaSchema.index({ title: 1, language: 1 }, { unique: true });

/* Referenzielle Integrität */
areaSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
  const docId = this.getFilter()._id;
  try {
    const categories = await mongoose.model('categoryModel').find({ area: docId });
    if (categories.length > 0) {
      next(
        new Error(
          'Diese Area wird noch von einer oder mehreren Kategorien referenziert und kann nicht gelöscht werden.'
        )
      );
    } else next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('areaModel', areaSchema, 'area');
