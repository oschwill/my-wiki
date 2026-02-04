import express from 'express';
import {
  getAllCategoriesByAreaAndLocale,
  getArea,
  getCategory,
  getLanguages,
  getPublicAreasByLocale,
  getSingleArticleById,
  getAllArticlesByCategoryAndLocale,
} from '../controller/contentController.js';
export const router = express.Router();

/* OUTPUT AREA / CATEGORY FOR ADMIN */
router.route('/getArea').get(getArea);
router.route('/getCategory').get(getCategory);

/* GET PUBLIC AREAS / CATEGORIES / ARTICLES BY LOCALE */
router.route('/public/areas').get(getPublicAreasByLocale); // Hole alle Areas
router.route('/public/category/:id').get(getAllCategoriesByAreaAndLocale); // Hole alle Kategorien der Area
router.route('/public/articles/:id').get(getAllArticlesByCategoryAndLocale); // Hole alle Artikel der Kategorie
router.route('/public/article/:id').get(getSingleArticleById); // Hole den Artikel by ID

/* TRANSLATION / LAGNUAGES */
router.route('/getLanguages').get(getLanguages);
