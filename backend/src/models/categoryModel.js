import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
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
  },
  area: {
    type: mongoose.Schema.ObjectId,
    ref: 'areaModel',
  },
});

/* REFERENZIELLE INTEGRITÄT */
// Abchecken ob die Category die man Löschen möchte noch irgendwo verwendet wird
categorySchema.pre('remove', async function (next) {
  const category = this;
  try {
    const categories = await mongoose.model('articleModel').find({ category: category._id });
    if (categories.length > 0) {
      next(
        new Error(
          'Diese Category wird noch von einer oder mehreren Artikeln referenziert und kann nicht gelöscht werden.'
        )
      );
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('categoryModel', categorySchema, 'category');
