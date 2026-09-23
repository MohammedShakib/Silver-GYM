import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import * as passController from '../controllers/pass.controller.js';

const router = Router();

router.use(requireAuth);
router.post('/tokens', passController.generatePass);

export default router;
