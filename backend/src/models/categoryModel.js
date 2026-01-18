import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  translationGroup: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  title: { type: String, required: true, default: 'Sonstiges' },
  description: { type: String },
  area: { type: mongoose.Schema.ObjectId, ref: 'areaModel', required: true },
  language: { type: mongoose.Schema.ObjectId, ref: 'languageModel', required: true, index: true },
});

categorySchema.index({ title: 1, language: 1, area: 1 }, { unique: true });

/* Referenzielle Integrität */
categorySchema.pre('deleteOne', { document: false, query: true }, async function (next) {
  const docId = this.getFilter()._id;
  try {
    const articles = await mongoose.model('articleModel').find({ category: docId });
    if (articles.length > 0) {
      next(
        new Error(
          'Diese Kategorie wird noch von einer oder mehreren Artikeln referenziert und kann nicht gelöscht werden.'
        )
      );
    } else next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('categoryModel', categorySchema, 'category');
