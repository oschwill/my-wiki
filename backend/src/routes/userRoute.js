import express from 'express';

import { uploadImage } from '../utils/cloudHelper.js';
import { registerUser } from '../controller/userController.js';
import { multerErrorHandling, upload } from '../utils/multerStorage.js';

export const router = express.Router();

/* REGISTER */
router
  .route('/register')
  .post(upload, multerErrorHandling, uploadImage('my-wiki/userProfile/profileImage'), registerUser);
