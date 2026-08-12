import express from 'express';
import {
  getUnreadMessageCount,
  getMyMessages,
  markMessageAsRead,
} from '../controller/messagingController.js';

import { verifyToken } from '../middleware/token.js';

export const router = express.Router();

router.get('/unread-count', verifyToken, getUnreadMessageCount);
router.get('/my-messages', verifyToken, getMyMessages);
router.patch('/:id/read', verifyToken, markMessageAsRead);
