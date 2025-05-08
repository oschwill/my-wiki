import express from 'express';
import { rateLimit } from 'express-rate-limit';
import {
  changeUserPassword,
  checkAuth,
  checkTwoFactorToken,
  completeRegisterUser,
  getMyProfileData,
  logOutUser,
  loginUser,
  registerUser,
  resendEmailToken,
  updateUserProfile,
} from '../controller/userController.js';
import { upload } from '../utils/multerStorage.js';
import { verifyToken } from '../middleware/token.js';
import { changeProfileImage } from '../middleware/fileHandler.js';

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
router.route('/check-2fa/resendToken').patch(limiter, resendEmailToken);
router.route('/login').post(upload.none(), loginUser);
router.route('/check-2fa').post(checkTwoFactorToken);
router.route('/logout').post(verifyToken, logOutUser);
router.route('/check-auth').post(verifyToken, checkAuth);

/* PROFILE */
router.route('/me').get(verifyToken, getMyProfileData); // Meine Profil Seite
router.route('/user-profile/:userID').get(verifyToken, getMyProfileData); // Profilseite von anderen Usern!
router.route('/changePassword').patch(verifyToken, changeUserPassword);
router
  .route('/changeUserData')
  .patch(verifyToken, upload.single('profileImage'), changeProfileImage, updateUserProfile);
