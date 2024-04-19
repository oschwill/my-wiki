import express from 'express';
import { onlyForCreator, onlyForCreatorProperty, verifyToken } from '../middleware/token.js';
import { insertArticle, updateArticle } from '../controller/creatorController.js';
import { upload } from '../utils/multerStorage.js';

export const router = express.Router();

router.route('/createArticle').post(verifyToken, onlyForCreator, upload.none(), insertArticle);
router
  .route('/updateArticle/:articleId')
  .put(verifyToken, upload.none(), onlyForCreatorProperty, updateArticle);
