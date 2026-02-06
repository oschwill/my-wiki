import express from 'express';
import { onlyForCreator, onlyForCreatorProperty, verifyToken } from '../middleware/token.js';
import {
  deleteArticle,
  getUserArticleById,
  insertOrUpdateArticle,
  publishOrDraftArticle,
  ShowMyArticles,
} from '../controller/creatorController.js';
import { upload } from '../utils/multerStorage.js';

export const router = express.Router();

router
  .route('/createArticle')
  .post(verifyToken, onlyForCreator, upload.none(), insertOrUpdateArticle);
router
  .route('/updateArticle/:id')
  .put(verifyToken, upload.none(), onlyForCreatorProperty, insertOrUpdateArticle);
router.route('/deleteArticle/:id').delete(verifyToken, onlyForCreatorProperty, deleteArticle);
router
  .route('/publishArticle/:id')
  .patch(verifyToken, onlyForCreatorProperty, publishOrDraftArticle);

/* SHOW / GET MY ARTICLES */
router.route('/showMyArticles').get(verifyToken, onlyForCreator, ShowMyArticles);
router.route('/getMySingleArticle/:id').get(verifyToken, onlyForCreator, getUserArticleById);
