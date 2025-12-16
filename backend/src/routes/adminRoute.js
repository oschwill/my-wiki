import express from 'express';
import { verifyToken, onlyForAdmin } from '../middleware/token.js';
import {
  blockOrUnblockUser,
  deleteArea,
  deleteCategory,
  deleteLanguage,
  deleteUser,
  getAllUsers,
  insertAreaBatch,
  insertCategoryBatch,
  insertLanguage,
  toggleLanguage,
  updateAreaBatch,
  updateCategoryBatch,
  upgradeOrDownGradeUserRights,
} from '../controller/adminController.js';

export const router = express.Router();

/* INPUT AREA / CATEGORY */
router.route('/insertAreaBatch').post(verifyToken, onlyForAdmin, insertAreaBatch);
router.route('/updateAreaBatch').put(verifyToken, onlyForAdmin, updateAreaBatch);
router.route('/deleteArea').delete(verifyToken, onlyForAdmin, deleteArea);

router.route('/insertCategoryBatch').post(verifyToken, onlyForAdmin, insertCategoryBatch);
router.route('/updateCategoryBatch').put(verifyToken, onlyForAdmin, updateCategoryBatch);
router.route('/deleteCategory').delete(verifyToken, onlyForAdmin, deleteCategory);

/* BLOCK OR DELETE USERS */
router.route('/blockUser').patch(verifyToken, onlyForAdmin, blockOrUnblockUser);
router.route('/deleteUser').delete(verifyToken, onlyForAdmin, deleteUser);

/* SHOW ALL USERS */
router.route('/allUsers').get(verifyToken, onlyForAdmin, getAllUsers); // Alle User darf nur der Admin einsehen

/* UPGRADE USER */
router.route('/upgradeUser').patch(verifyToken, onlyForAdmin, upgradeOrDownGradeUserRights);

/* LANGUAGES */
router.route('/insertLanguage').post(verifyToken, onlyForAdmin, insertLanguage);
router.route('/deleteLanguage').delete(verifyToken, onlyForAdmin, deleteLanguage);
router.route('/de-activateLanguage').patch(verifyToken, onlyForAdmin, toggleLanguage);
