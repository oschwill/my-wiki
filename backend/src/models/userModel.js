import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['visitor', 'creator', 'admin'],
    required: true,
    default: 'visitor',
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  emailVerifyCode: {
    type: String,
    maxLength: [6, 'Must be 6 digit long'],
  },
  active: {
    type: Boolean,
    default: false,
  },
  profileImage: Object,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

// Wir erzeugen den Username aus dem ersten Buchstaben des Vornamens + des Nachnamens
userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = `${this.firstName[0]}${this.lastName}`.toLowerCase();
  }

  next();
});

export default mongoose.model('userModel', userSchema, 'user');
