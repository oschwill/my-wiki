import express from 'express';
import { onlyForCreator, verifyToken } from '../middleware/token.js';
import { insertArticle } from '../controller/creatorController.js';
import { upload } from '../utils/multerStorage.js';

export const router = express.Router();

router.route('/createArticle').post(verifyToken, onlyForCreator, upload.none(), insertArticle);
