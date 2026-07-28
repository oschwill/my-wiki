import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'articleModel',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userModel',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Comment', commentSchema);
