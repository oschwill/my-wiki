import express from 'express';
import { verifyToken, onlyForAdmin } from '../middleware/token.js';
import {
  blockOrUnblockUser,
  deleteArea,
  deleteCategory,
  deleteUser,
  getAllUsers,
  insertArea,
  insertCategory,
  updateArea,
  updateCategory,
  upgradeOrDownGradeUserRights,
} from '../controller/adminController.js';

export const router = express.Router();

/* INPUT AREA / CATEGORY */
router.route('/insertArea').post(verifyToken, onlyForAdmin, insertArea);
router.route('/updateArea').put(verifyToken, onlyForAdmin, updateArea);
router.route('/deleteArea').delete(verifyToken, onlyForAdmin, deleteArea);

router.route('/insertCategory').post(verifyToken, onlyForAdmin, insertCategory);
router.route('/updateCategory').put(verifyToken, onlyForAdmin, updateCategory);
router.route('/deleteCategory').delete(verifyToken, onlyForAdmin, deleteCategory);

/* BLOCK OR DELETE USERS */
router.route('/blockUser').patch(verifyToken, onlyForAdmin, blockOrUnblockUser);
router.route('/deleteUser').delete(verifyToken, onlyForAdmin, deleteUser);

/* SHOW ALL USERS */
router.route('/allUsers').get(verifyToken, onlyForAdmin, getAllUsers); // Alle User darf nur der Admin einsehen

/* UPGRADE USER */
router.route('/upgradeUser').patch(verifyToken, onlyForAdmin, upgradeOrDownGradeUserRights);
