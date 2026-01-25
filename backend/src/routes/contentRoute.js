import express from 'express';
import {
  getAllArticlesByCategory,
  getArea,
  getCategory,
  getCategoryByAreaId,
  getLanguages,
  getPublicAreasByLocale,
  getSingleArticleById,
} from '../controller/contentController.js';
export const router = express.Router();

/* OUTPUT AREA / CATEGORY FOR ADMIN */
router.route('/getArea').get(getArea);
router.route('/getCategory').get(getCategory);

/* GET PUBLIC AREAS / CATEGORIES / ARTICLES BY LOCALE */
router.route('/public/areas').get(getPublicAreasByLocale);
router.route('/getAllArticlesByCategory/:id').get(getAllArticlesByCategory);
router.route('/getSingleArticle/:id').get(getSingleArticleById);
router.route('/getCategory/:id').get(getCategoryByAreaId);

/* TRANSLATION / LAGNUAGES */
router.route('/getLanguages').get(getLanguages);
