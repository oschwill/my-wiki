import express from 'express';
import { getArea, getCategory } from '../controller/contentController';
export const router = express.Router();

/* OUTPUT AREA / CATEGORY */
router.route('/getArea').get(getArea);
router.route('/getCategory').get(getCategory);
