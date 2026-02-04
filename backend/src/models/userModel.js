import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema(
  {
    externalId: { type: String, default: null },
    provider: { type: String, enum: ['github', 'google', null], default: null },
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
      required: [
        function () {
          return this.username ? true : false;
        },
        'Username is required',
      ],
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
    forgotPasswordToken: {
      type: String,
      default: null,
    },
    forgotPasswordTokenExpires: {
      type: Date,
      default: null,
    },
    changePasswordToken: {
      type: String,
      default: null,
    },
    changePasswordTokenExpires: {
      type: Date,
      default: null,
    },
    email: {
      type: String,
      // required: true,
      index: {
        unique: true,
      },
    },
    emailVerifyCode: {
      type: String,
      maxLength: [6, 'Must be 6 digit long'],
    },
    changeEmailToken: {
      type: String,
      default: null,
    },
    changeEmailTokenExpires: {
      type: Date,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: Object,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
    },
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },
    loginVerifyToken: {
      type: String,
      default: null,
    },
    loginVerifyTokenExpires: {
      type: Date,
      default: null,
    },
    changePasswordVerifyToken: {
      type: String,
      default: null,
    },
    changePasswordVerifyTokenExpires: {
      type: Date,
      default: null,
    },
    notifyOnNewArticles: {
      type: Boolean,
      default: false,
    },
    emailNotifyOnNewArticles: {
      type: Boolean,
      default: false,
    },
    allowMessages: {
      type: Boolean,
      default: true,
    },
    isProfilePrivate: {
      type: Boolean,
      default: false,
    },
    isEmailPrivate: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    userHash: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
  },
  { strict: false },
);

// Wir erzeugen den Username aus dem ersten Buchstaben des Vornamens + des Nachnamens
userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = `${this.firstName[0]}${this.lastName}`.toLowerCase();
  }

  next();
});

export default mongoose.model('userModel', userSchema, 'user');
