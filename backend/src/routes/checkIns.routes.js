import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { createCheckIn } from '../controllers/checkIns.controller.js';

const router = Router();

router.use(requireAuth);

router.post('/', createCheckIn);

export default router;
