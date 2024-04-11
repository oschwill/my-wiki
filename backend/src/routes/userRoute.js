import express from 'express';
import { rateLimit } from 'express-rate-limit';

import { uploadImage } from '../utils/cloudHelper.js';
import {
  completeRegisterUser,
  registerUser,
  resendEmailToken,
} from '../controller/userController.js';
import { multerErrorHandling, upload } from '../utils/multerStorage.js';

export const router = express.Router();

// refresh Email Token limit einbauen, damit der User nicht durchgehend neu sendet
export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // alle 1 Minute darf gesendet werden!
  max: 1,
  message: (req) => {
    return {
      success: false,
      message:
        'Zu viele Anfragen von dieser IP, bitte versuchen Sie es später erneut. Und checken Sie Ihre Email Adresse',
    };
  },
});

/* REGISTER */
router
  .route('/register')
  .post(
    upload.single('profileImage'),
    multerErrorHandling,
    uploadImage('my-wiki/userProfile/profileImage'),
    registerUser
  );
router.route('/register').patch(completeRegisterUser);
router.route('/register/resendToken').patch(limiter, resendEmailToken);
