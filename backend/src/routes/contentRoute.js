import express from 'express';
import {
  getAllArticlesByCategory,
  getArea,
  getCategory,
  getSingleArticleById,
} from '../controller/contentController.js';
export const router = express.Router();

/* OUTPUT AREA / CATEGORY */
router.route('/getArea').get(getArea);
router.route('/getCategory/:id').get(getCategory);
router.route('/getAllArticlesByCategory/:id').get(getAllArticlesByCategory);
router.route('/getSingleArticle/:id').get(getSingleArticleById);
