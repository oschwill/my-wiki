import express from 'express';
import {
  getAllArticlesByCategory,
  getArea,
  getCategory,
  getCategoryById,
  getSingleArticleById,
} from '../controller/contentController.js';
export const router = express.Router();

/* OUTPUT AREA / CATEGORY */
router.route('/getArea').get(getArea);
router.route('/getCategory').get(getCategory);
router.route('/getCategory/:id').get(getCategoryById);
router.route('/getAllArticlesByCategory/:id').get(getAllArticlesByCategory);
router.route('/getSingleArticle/:id').get(getSingleArticleById);
