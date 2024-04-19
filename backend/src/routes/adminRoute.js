import express from 'express';
import { verifyToken, onlyForAdmin } from '../middleware/token.js';
import { insertArea, insertCategory } from '../controller/adminController.js';

export const router = express.Router();

/* INPUT AREA / CATEGORY */

router.route('/insertArea').post(verifyToken, onlyForAdmin, insertArea);
router.route('/insertCategory').post(verifyToken, onlyForAdmin, insertCategory);
