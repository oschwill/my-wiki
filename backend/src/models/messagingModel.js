import mongoose from 'mongoose';

const messagingSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
    default: null,
  },
  type: {
    type: String,
    enum: [
      'comment_created',
      'profile_message',
      'creator_request',
      'creator_request_accepted',
      'creator_request_rejected',
      'system',
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articleModel',
    default: null,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  articleUrl: {
    type: String,
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

messagingSchema.index({
  recipient: 1,
  read: 1,
  createdAt: -1,
});

export default mongoose.model('Messaging', messagingSchema);
