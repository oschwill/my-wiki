import express from 'express';
import { rateLimit } from 'express-rate-limit';
import {
  changeProfileImage,
  changeUserPassword,
  checkAuth,
  completeRegisterUser,
  logOutUser,
  loginUser,
  registerUser,
  resendEmailToken,
  updateUserProfile,
} from '../controller/userController.js';
import { multerErrorHandling, upload } from '../utils/multerStorage.js';
import { verifyToken } from '../middleware/token.js';

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

/* AUTH */
router.route('/register').post(registerUser);
router.route('/register').patch(completeRegisterUser);
router.route('/register/resendToken').patch(limiter, resendEmailToken);
router.route('/login').post(upload.none(), loginUser);
router.route('/logout').post(verifyToken, logOutUser);
router.route('/check-auth').post(verifyToken, checkAuth);

/* PROFILE */
router.route('user/changePassword').patch(verifyToken, changeUserPassword);
router
  .route('user/changeProfileImage')
  .patch(verifyToken, upload.single('profileImage'), multerErrorHandling, changeProfileImage);
router.route('user/changeUserData').patch(verifyToken, upload.none(), updateUserProfile);
