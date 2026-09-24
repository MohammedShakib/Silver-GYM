import express from 'express';
import { requireAuth } from '../middlewares/auth.js';
import * as notificationController from '../controllers/notification.controller.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/:id/read', notificationController.markAsRead);
router.post('/read-all', notificationController.markAllAsRead);

router.get('/preferences', notificationController.getPreferences);
router.patch('/preferences', notificationController.updatePreferences);

export default router;
