import express from 'express';
import { onlyForCreator, onlyForCreatorProperty, verifyToken } from '../middleware/token.js';
import {
  deleteArticle,
  insertArticle,
  publishOrDraftArticle,
  ShowMyArticles,
  updateArticle,
} from '../controller/creatorController.js';
import { upload } from '../utils/multerStorage.js';

export const router = express.Router();

router.route('/createArticle').post(verifyToken, onlyForCreator, upload.none(), insertArticle);
router
  .route('/updateArticle/:id')
  .put(verifyToken, upload.none(), onlyForCreatorProperty, updateArticle);
router.route('/deleteArticle/:id').delete(verifyToken, onlyForCreatorProperty, deleteArticle);
router
  .route('/publishArticle/:id')
  .patch(verifyToken, onlyForCreatorProperty, publishOrDraftArticle);

/* SHOW MY ARTICLES */
router.route('/showMyArticles').get(verifyToken, onlyForCreator, ShowMyArticles);
