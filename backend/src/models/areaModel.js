import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
    default: 'Sonstiges',
  },
  description: {
    type: String,
    required: true,
  },
  queryPath: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

/* REFERENZIELLE INTEGRITÄT */
// Abchecken ob die Area die man Löschen möchte noch irgendwo verwnedet wird
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
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('areaModel', areaSchema, 'area');
